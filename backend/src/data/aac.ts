import mongoose from "mongoose";
import { config } from "../config/config";
import path from "path";
import { readFileSync } from "fs";
import Account, { IAccount, Status } from "../models/Account";
import Transaction, { ITransaction } from "../models/Transaction";
import AccountService from "../services/AccountService";

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
      const formattedTransactionsData = JSON.parse(transactionsData);

      // set status to boolean and filter out duplicate emails
      const seen = new Set();
      let formattedAccountData = JSON.parse(accountsData)
        .map((d: IAccount) => {
          d.status = d.status === "active" ? Status.active : Status.inactive;

          //filter all transactions for this account
          d["transactions"] = formattedTransactionsData.filter(
            (t: ITransaction) => t.userEmail === d.userEmail
          );

          return d;
        })
        .filter((el: IAccount) => {
          const duplicate = seen.has(el.userEmail);
          seen.add(el.userEmail);
          return !duplicate;
        });

      const as = new AccountService();

      for (const a of formattedAccountData) {
        await as.addAccount(a);
      }

      if (callback) callback();
    });
  } catch (e) {
    console.log((e as Error).message);
  }
}
