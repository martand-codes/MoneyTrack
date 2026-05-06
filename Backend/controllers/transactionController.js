
import transactionModel from "../models/transactionModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFiltering.js";


// add Transaction

export async function addTransaction(req, res) {
    const userId = req.user.id;  // No _id because we are refactoring from DB
    const { description, amount, category, date, type } = req.body;
        

    try {
        if(!description || amount == null || !category || !type){
            return res.status(400).json({
                success: false,
                message: "All Fields are required!!"
            });
        }
        const normalizedCategory = category.trim().toLowerCase();
        const normalizedType = type?.toLowerCase();

        // For Type

        if(!["income", "expense"].includes(normalizedType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Type Field"
            });
        }
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }
        const newTransaction = await transactionModel.create({
            userId,
            description,
            amount,
            category: normalizedCategory,
            type: normalizedType,
            date: date ? new Date(date) : Date.now()
        });
            
        return res.status(201).json({
            success: true,
            message: "Transaction Added SuccessFully!",
            data: newTransaction
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Get Transaction

export async function getTransactions(req, res) {
    const userId = req.user.id;
    const { type, category, page = 1, limit = 10 } = req.query;

    try {
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(50, Math.max(1, Number(limit)));

        const filter = { userId };

        if (type) filter.type = type.toLowerCase();
        if (category) filter.category = category.trim().toLowerCase();

        const transactions = await transactionModel
            .find(filter)
            .sort({ date: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        return res.json({
            success: true,
            data: transactions,
            page: pageNum,
            limit: limitNum
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// For Update The Transaction

export async function updateTransaction(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const { description, amount, type, category } = req.body;

    try {

        if (amount != null && amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }

        // To prevent Data Corruption

        const updateFields = {};
        if (description) updateFields.description = description;
        if (amount != null) updateFields.amount = amount;
        if (category) updateFields.category = category.trim().toLowerCase();
        

        // For type

            if (type) {
            const normalizedType = type.toLowerCase();

            if (!["income", "expense"].includes(normalizedType)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid type"
                });
            }

            updateFields.type = normalizedType;
        }

        const updatedTransaction = await transactionModel.findOneAndUpdate(
            { _id: id, userId },
             updateFields,
            { new: true}
        );

        if(!updatedTransaction) {
            return  res.status(404).json({
                success: false,
                message: "Transaction Not Found!"
            });
        }
        
        return res.json({
            success: true,
            message: "Transaction Updated SuccessFully!",
            data: updatedTransaction
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// To Delete Income

export async function deleteTransaction(req, res) {
    
    // To Prevent deleting for different User

    const { id } = req.params;
    const userId = req.user.id;
    try {
        const transaction = await transactionModel.findOneAndDelete({
            _id: id,
            userId
        });
        if(!transaction) {
            return res.status(404).json({
                success: false,
                message: "Income Not Found"
            });
        }
        return res.json({
            success: true,
            message: "Income Deleted Successfully!"
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// For xlsx

export async function downloadExcel(req, res) {
    const userId = req.user.id;
    const { type } = req.query;

    try {
        const filter = { userId };

        // Handling type 
        if (type) {
            const normalizedType = type.toLowerCase();

            if (!["income", "expense"].includes(normalizedType)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid type"
                });
            }

            filter.type = normalizedType;
        }

        const transactions = await transactionModel
            .find(filter)
            .sort({ date: -1 })
            .lean();

        const plainData = transactions.map((t) => ({
            Description: t.description?.trim(),
            Amount: `₹${t.amount}`,
            Category: t.category?.trim(),
            Type: t.type,
            Date: new Date(t.date).toISOString().slice(0, 19).replace("T", " "),
        }));

        // Add total row 
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);

        plainData.push({}); // For Space

        plainData.push({
            Description: "TOTAL",
            Amount: `₹${total}`,
            Category: "",
            Type: "",
            Date: ""
        });

        const worksheet = XLSX.utils.json_to_sheet(plainData, {
            header: ["Description", "Amount", "Category", "Type", "Date"]
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });

        const fileName = type ? `${type}.xlsx` : "transactions.xlsx";

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${fileName}`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return res.send(buffer);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// For Transaction OverView

export async function getTransactionOverview(req, res) {
    try {
        const userId = req.user.id;
        const { range = "monthly" } = req.query;
        const { start, end } = getDateRange(range);

        const transactions = await transactionModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 }).lean();

        if (transactions.length === 0) {
            return res.json({
                success: true,
                data: {
                    totalIncome: 0,
                    totalExpense: 0,
                    balance: 0,
                    averageTransaction: 0,
                    numberOfTransactions: 0,
                    recentTransactions: [],
                    range,
                },
                message: "No transactions found in this range"
            });
        }

        let totalIncome = 0;
        let totalExpense = 0;
        let totalVolume = 0;

        for (const t of transactions) {
            totalVolume += t.amount;

            if (t.type === "income") totalIncome += t.amount;
            else if (t.type === "expense") totalExpense += t.amount;
            else console.warn("Unknown Transaction Type!");
        }

        const balance = totalIncome - totalExpense;

        const numberOfTransactions = transactions.length;

        const averageTransaction =
            numberOfTransactions > 0
                ? totalVolume / numberOfTransactions
                : 0;

        const recentTransactions = transactions.slice(0, 5);

        const round = (num) => Math.round(num * 100) / 100;

        return res.json({
            success: true,
            data: {
                totalIncome: round(totalIncome),
                totalExpense: round(totalExpense),
                balance: round(balance),
                averageTransaction: round(averageTransaction),
                numberOfTransactions,
                recentTransactions,
                range,
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}