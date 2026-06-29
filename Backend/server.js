import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import transactionRouter from './routes/transactionRoute.js';
import dashboardRouter from './routes/dashboardRouter.js';

const app = express();
const port = process.env.PORT || 5000; 

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// DB

connectDB();

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/dashboard", dashboardRouter);


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "MoneyTrack Backend API is Live 🚀"
    });
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});


