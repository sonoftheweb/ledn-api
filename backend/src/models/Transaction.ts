import mongoose, { Schema, Document } from "mongoose";

export enum TransactionType {
  receive,
  send,
}

export interface ITransaction extends Document {
  userEmail: string;
  amount: number;
  type: TransactionType;
  createdAt?: Date;
}

const TransactionSchema: Schema = new Schema({
  userEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date },
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
