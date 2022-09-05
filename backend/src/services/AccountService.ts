import Account, { IAccount, Status } from "../models/Account";
import MainService from "./MainService";
import mongoose from "mongoose";
import { isObjectId } from "../helpers/string-helpers";
import { ITransaction, TransactionType } from "../models/Transaction";
import { transactionWrapper } from "../helpers/db-helper";
import TransactionService from "./TransactionService";
import { getBalanceFromTransactions } from "../helpers/transaction-helpers";

class AccountService extends MainService {
  account: mongoose.Model<IAccount>;
  transactionService: TransactionService;

  constructor() {
    super();
    this.account = Account;
    this.transactionService = new TransactionService();
  }

  public async addAccount(account: IAccount): Promise<IAccount> {
    return this.account.create(account);
  }

  public async addAccounts(accounts: IAccount[]): Promise<IAccount[]> {
    return this.account.insertMany(accounts);
  }

  public async get(
    page: number = 1,
    perPage: number = 10
  ): Promise<Array<IAccount>> {
    // or you could do Promise<IAccount[]>
    try {
      return await this.account
        .find()
        .limit(perPage)
        .skip(perPage * page);
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  public async find(
    identifier: string,
    withTransactions: boolean = true
  ): Promise<IAccount | null> {
    try {
      let data,
        filter = isObjectId(identifier)
          ? { _id: identifier }
          : { userEmail: identifier };
      if (withTransactions) {
        data = await this.account.findOne(filter).populate("transactions");
      } else {
        data = await this.account.findOne(filter);
      }
      return data;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  public async addTransactionToAccount(
    account_identifier: string,
    amount: number,
    transaction_type: TransactionType
  ): Promise<string | IAccount> {
    let account = await this.find(account_identifier, true);

    if (account) {
      if (
        transaction_type === TransactionType.send &&
        getBalanceFromTransactions(account.transactions as ITransaction[]) <
          amount
      ) {
        throw new Error("Insufficient balance!");
      }

      if (account.status === Status.locked) throw new Error("Account locked!");

      await transactionWrapper(async (session) => {
        let transaction = await this.transactionService.addTransaction({
          userEmail: account?.userEmail,
          amount: amount,
          type: transaction_type,
          account: account?._id,
        } as ITransaction);
        account?.transactions?.push(transaction);
        await account?.save();
      });

      return account;
    } else {
      return "Requires account!";
    }
  }

  async update(param: { status: Status }, account: IAccount | string) {
    let stringId;
    if (isObjectId(account as string)) {
      stringId = account;
    } else {
      stringId = (account as IAccount)._id;
    }

    return this.account.findByIdAndUpdate(stringId, param, {
      upsert: false,
      new: true,
    });
  }
}

export default AccountService;
