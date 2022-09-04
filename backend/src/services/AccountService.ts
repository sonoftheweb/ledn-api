import Account, { IAccount } from "../models/Account";
import MainService from "./MainService";
import mongoose from "mongoose";
import { isObjectId } from "../helpers/string-helpers";

export interface IAccountService {
  account: mongoose.Model<IAccount>;
  addAccount: (account: IAccount) => Promise<IAccount>;
  addAccounts: (account: IAccount[]) => Promise<IAccount[]>;
  get: (page: number, perPage: number) => Promise<IAccount[]>;
  addTransactions: (
    accountId: string,
    transactionIds: string[]
  ) => Promise<void>;
}

class AccountService extends MainService implements IAccountService {
  account: mongoose.Model<IAccount>;

  constructor() {
    super();
    this.account = Account;
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
        .populate("transactions")
        .limit(perPage)
        .skip(perPage * page);
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  public async find(
    identifier: string,
    withTransactions: boolean = true
  ): Promise<any> {
    try {
      let data,
        filter = isObjectId(identifier)
          ? { _id: identifier }
          : { userEmail: identifier };
      if (withTransactions) {
        data = await this.account
          .findOne(filter)
          .populate("transactions")
          .exec();
      } else {
        data = await this.account.findOne(filter);
      }
      return data;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  public async addTransactions(accountId: string, transactionIds: string[]) {
    this.account.findByIdAndUpdate(
      accountId,
      { transaction: transactionIds },
      { new: true, useFindAndModify: false }
    );
  }
}

export default AccountService;
