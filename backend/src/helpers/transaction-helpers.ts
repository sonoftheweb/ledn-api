import { ITransaction, TransactionType } from "../models/Transaction";

export const getBalanceFromTransactions = (transactions: ITransaction[]) => {
  return transactions.reduce((a: number, t: ITransaction) => {
    if (t.type === TransactionType.receive) {
      return a + t.amount;
    } else {
      return a - t.amount;
    }
  }, 0);
};
