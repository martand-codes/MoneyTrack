import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1, "Amount must be greater than 0"]
    },
    category: {
        type: String,
        required: true,
        lowercase: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        default: "income",
        lowercase: true
    }
}, {
    timestamps: true
});

transactionSchema.index({ userId: 1, date: -1 });

const transactionModel = mongoose.models.transaction || mongoose.model("transaction", transactionSchema);
export default transactionModel;