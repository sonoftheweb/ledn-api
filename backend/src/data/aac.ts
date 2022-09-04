import mongoose from "mongoose";
import { config } from "../config/config";
import path from "path";
import { readFileSync } from "fs";
import Account, { IAccount, Status } from "../models/Account";
import Transaction, { ITransaction } from "../models/Transaction";
import AccountService from "../services/AccountService";
import TransactionService from "../services/TransactionService";

export function addAccounts(
  size: string = "small",
  callback: (() => void) | undefined
) {
  try {
    mongoose.connect(config.mongo.url).then(async () => {
      // clear all collections
      await Account.deleteMany();
      await Transaction.deleteMany();

      const files =
        size === "small"
          ? {
              accounts: "accounts-api.json",
              transactions: "transactions-api.json",
            }
          : {
              accounts: "accounts-api-large.json",
              transactions: "transactions-api-large.json",
            };

      let accountsData = readFileSync(
        path.join(__dirname, files.accounts),
        "utf8"
      );

      let transactionsData = readFileSync(
        path.join(__dirname, files.transactions),
        "utf8"
      );
      let formattedTransactionsData = JSON.parse(transactionsData)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((t: ITransaction) => {
          t._id = new mongoose.Types.ObjectId().toString();
          return t;
        });

      // set status to boolean and filter out duplicate emails
      const seen = new Set();
      let formattedAccountData = JSON.parse(accountsData)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((d: IAccount) => {
          d.status = d.status === "active" ? Status.active : Status.inactive;
          d._id = new mongoose.Types.ObjectId().toString();

          //filter all transactions for this account
          d.transactions = formattedTransactionsData
            .filter((t: ITransaction) => t.userEmail === d.userEmail)
            .map((t: ITransaction) => t._id);

          return d;
        })
        .filter((el: IAccount) => {
          const duplicate = seen.has(el.userEmail);
          seen.add(el.userEmail);
          return !duplicate;
        });

      formattedTransactionsData = formattedTransactionsData.map(
        (t: ITransaction) => {
          t.account = formattedAccountData.find(
            (a: IAccount) => a.userEmail === t.userEmail
          )?._id;
          return t;
        }
      );

      const as = new AccountService();
      const ts = new TransactionService();

      await ts.addTransactions(formattedTransactionsData);
      await as.addAccounts(formattedAccountData);

      if (callback) callback();
    });
  } catch (e) {
    console.log((e as Error).message);
  }
}
