import mongoose, { Schema, Document } from "mongoose";
import Transaction, { ITransaction } from "./Transaction";

export enum Status {
  active = 1,
  locked = 0,
}

export interface IAccount extends Document {
  _id?: string;
  userEmail: string;
  status: Status | String;
  transactions?: ITransaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

const AccountSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true, unique: true },
    status: { type: Number, required: true },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: Transaction }],
  },
  { timestamps: true }
);

export default mongoose.model<IAccount>("Account", AccountSchema);
