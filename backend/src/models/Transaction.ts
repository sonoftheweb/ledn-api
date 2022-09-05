import mongoose, { Schema, Document } from "mongoose";
import { IAccount } from "./Account";

export enum TransactionType {
  receive = "receive",
  send = "send",
}

export interface ITransaction extends Document {
  _id?: string;
  userEmail: string;
  amount: number;
  type: TransactionType;
  account?: IAccount;
  createdAt?: Date;
}

const TransactionSchema: Schema = new Schema({
  userEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  createdAt: { type: Date, default: Date.now() },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
