import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { addTransaction, deleteTransaction, downloadExcel, getTransactionOverview, getTransactions, updateTransaction } from '../controllers/transactionController.js';


const transactionRouter = express.Router();

transactionRouter.post("/add", authMiddleware, addTransaction);
transactionRouter.get("/get", authMiddleware, getTransactions);

transactionRouter.put("/update/:id", authMiddleware, updateTransaction);
transactionRouter.get("/downloadexcel", authMiddleware, downloadExcel);
transactionRouter.delete("/delete/:id", authMiddleware, deleteTransaction);
transactionRouter.get("/overview", authMiddleware, getTransactionOverview);

export default transactionRouter;