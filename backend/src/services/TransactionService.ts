import Transaction, { ITransaction } from "../models/Transaction";
import AccountService from "./AccountService";

class TransactionService {
  private transaction = Transaction;

  public async create(transaction: ITransaction) {
    return this.transaction.create(transaction);
  }

  async addTransactions(transactions: ITransaction[]) {
    return this.transaction.insertMany(transactions);
  }
}

export default TransactionService;
