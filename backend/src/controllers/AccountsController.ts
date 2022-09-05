import { NextFunction, Request, Response } from "express";
import AccountService from "../services/AccountService";
import { IAccount, Status } from "../models/Account";
import { getBalanceFromTransactions } from "../helpers/transaction-helpers";
import { HttpMethodsMap } from "./controller.intf";
import { ITransaction, TransactionType } from "../models/Transaction";

export class AccountsController implements HttpMethodsMap {
  index = async (req: Request, res: Response, next: NextFunction) => {
    const perPage = !req.query.perPage
      ? 10
      : parseInt(req.query.perPage as string);
    const page = !req.query.page ? 1 : parseInt(req.query.page as string);

    // I could just pass this in when instantiating the controller in Routes, but I am working against time
    // @todo: pass this in dynamically.
    let as = new AccountService();
    return res.send(await as.get(page, perPage));
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    return res.send("Do nothing");
  };

  fetch = async (req: Request, res: Response, next: NextFunction) => {
    const id_or_email = req.params.id_or_email;
    let withBalance = !req.query.withBalance ? true : req.query.withBalance;
    withBalance = withBalance === "true";
    let as = new AccountService(),
      data = await as.find(id_or_email, withBalance),
      balance,
      response: { account: IAccount; balance?: number } | string;

    if (data) {
      response = {
        account: data,
      };

      if (withBalance) {
        balance = getBalanceFromTransactions(
          data.transactions as ITransaction[]
        );
        response.balance = balance;
      }
    } else {
      response = "Account not found!";
    }

    return res.send(response);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    let {
      transaction_amount,
      transaction_type,
      account_status,
    }: {
      transaction_amount?: number;
      transaction_type?: string;
      account_status?: string;
    } = req.body;

    let as = new AccountService();

    let response = null;

    if (transaction_amount && transaction_type) {
      response = await this.addTransactionToAccount(
        as,
        req,
        transaction_amount,
        transaction_type as TransactionType
      );
    } else if (account_status) {
      response = "Status change has to differ from current status";
      let account = await as.find(req.params.id_or_email);
      if (account) {
        if (Status[account_status as keyof typeof Status] !== account.status) {
          response = await as.update(
            { status: Status[account_status as keyof typeof Status] },
            account
          );
        }
      } else {
        response = "Account not found!";
      }
    }
    return res.send(response);
  };

  async delete(req: Request, res: Response, next: NextFunction) {
    return res.send("Do nothing");
  }

  private addTransactionToAccount = async (
    as: AccountService,
    req: Request,
    transaction_amount: number,
    transaction_type: TransactionType
  ) => {
    try {
      return await as.addTransactionToAccount(
        req.params.id_or_email,
        transaction_amount,
        transaction_type
      );
    } catch (e) {
      return (e as Error).message;
    }
  };
}
