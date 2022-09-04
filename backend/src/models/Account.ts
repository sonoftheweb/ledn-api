import mongoose, { Schema, Document } from "mongoose";
import TransactionSchema, { ITransaction } from "./Transaction";

export enum Status {
  active = 1,
  inactive = 0,
}

export interface IAccount extends Document {
  userEmail: string;
  status: Status | String;
  transactions?: ITransaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

const AccountSchema: Schema = new Schema({
  userEmail: { type: String, required: true, unique: true },
  status: { type: Number, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
});

export default mongoose.model<IAccount>("Account", AccountSchema);
