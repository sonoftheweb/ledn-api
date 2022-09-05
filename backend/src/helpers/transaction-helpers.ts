import { ITransaction, TransactionType } from "../models/Transaction";

export const getBalanceFromTransactions = (transactions: ITransaction[]) => {
  let check = transactions.filter((item) => {
    !item.hasOwnProperty("amount");
  });

  if (check.length) return 0;

  return transactions.reduce((a: number, t: ITransaction) => {
    if (t.type === TransactionType.receive) {
      return a + t.amount;
    } else {
      return a - t.amount;
    }
  }, 0);
};
