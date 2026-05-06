import transactionModel from "../models/transactionModel.js";

export async function getDashboardOverview(req, res) {
    const userId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

try{

    const transactions = await transactionModel.find({
    userId,
    date: { $gte: startOfMonth, $lte: now },
    })
    .sort({ createdAt: -1 })
    .lean();

    const incomes = transactions.filter(t => t.type === "income");
    const expenses = transactions.filter(t => t.type === "expense");

    const monthlyIncome = incomes.reduce(
        (acc, cur) => acc + Number(cur.amount || 0), 0
    );

    const monthlyExpense = expenses.reduce(
        (acc, cur) => acc + Number(cur.amount || 0), 0
    );

    const savings = monthlyIncome - monthlyExpense;

    const savingsRate =
        monthlyIncome === 0
            ? 0
            : Math.round((savings / monthlyIncome) * 100);

    const recentTransactions = transactions.slice(0, 5);

    const spendByCategory = {};

    for (const exp of expenses) {
        const cat = (exp.category || "other").toLowerCase();
        spendByCategory[cat] =
            (spendByCategory[cat] || 0) + Number(exp.amount || 0);
    }

    const expenseDistribution = Object.entries(spendByCategory).map(
        ([category, amount]) => ({
            category,
            amount,
            percent:
            monthlyExpense === 0
                ? 0
                : Math.round((amount / monthlyExpense) * 100),
        })
    );

    const round = (num) => Math.round(num * 100) / 100;

    // For charts

    return res.status(200).json({
        success: true,
        data: {
            monthlyIncome: round(monthlyIncome),
            monthlyExpense: round(monthlyExpense),
            balance: round(savings),
            savingsRate,
            numberOfTransactions: transactions.length,
            incomeCount: incomes.length,
            expenseCount: expenses.length,
            recentTransactions,
            spendByCategory,
            expenseDistribution
        }
    });

    } catch (err) {
        console.error("Get Dashboard Error", err);
        return res.status(500).json({
            success: false,
            message: "Dashboard Call Failed"
        });

    }
}