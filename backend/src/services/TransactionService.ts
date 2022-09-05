import Transaction, { ITransaction } from "../models/Transaction";
import { IAccount } from "../models/Account";
import MainService from "./MainService";

class TransactionService extends MainService {
  private transaction = Transaction;

  public async addTransaction(transaction: ITransaction) {
    return this.transaction.create(transaction);
  }

  async addTransactions(transactions: ITransaction[]) {
    return this.transaction.insertMany(transactions);
  }

  public async get(
    page: number = 1,
    perPage: number = 10
  ): Promise<Array<ITransaction>> {
    // or you could do Promise<IAccount[]>
    try {
      return await this.transaction
        .find()
        .populate("account")
        .limit(perPage)
        .skip(perPage * page)
        .exec();
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }
}

export default TransactionService;
