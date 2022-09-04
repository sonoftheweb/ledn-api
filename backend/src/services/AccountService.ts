import Account, { IAccount } from "../models/Account";
import TransactionService from "./TransactionService";

class AccountService {
  private account = Account;
  private transactionService = new TransactionService();

  public async addAccount(account: IAccount) {
    let transactions;
    if (account.transactions?.length) {
      transactions = account.transactions;
      transactions = await this.transactionService.addTransactions(
        transactions
      );
      account.transactions = transactions.map((t) => t.id);
    }

    return this.account.create(account);
  }

  public async addAccounts(accounts: IAccount[]) {
    return this.account.insertMany(accounts);
  }

  public async accounts(
    page: number = 1,
    perPage: number = 10
  ): Promise<Array<IAccount>> {
    try {
      return await this.account
        .find()
        .limit(perPage)
        .skip(perPage * page);
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  public async get(userEmail: String): Promise<IAccount | null> {
    try {
      return await this.account.findOne({ userEmail: userEmail });
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  public async addTransactions(accountId: number, transactionIds: Number[]) {
    this.account.findByIdAndUpdate(
      accountId,
      { transaction: transactionIds },
      { new: true, useFindAndModify: false }
    );
  }
}

export default AccountService;
