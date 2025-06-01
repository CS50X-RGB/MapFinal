import mongoose from "mongoose";


const TransactionSchema = new mongoose.Schema({
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  fullfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
  },
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

export default TransactionModel;
