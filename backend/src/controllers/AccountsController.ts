import { NextFunction, Request, Response } from "express";
import AccountService from "../services/AccountService";
import { IAccount } from "../models/Account";
import { getBalanceFromTransactions } from "../helpers/transaction-helpers";
import { HttpMethodsMap } from "./controller.intf";

export class AccountsController implements HttpMethodsMap {
  async index(req: Request, res: Response, next: NextFunction) {
    const perPage = !req.query.perPage
      ? 10
      : parseInt(req.query.perPage as string);
    const page = !req.query.page ? 1 : parseInt(req.query.page as string);

    let as = new AccountService();

    return res.send(await as.get(page, perPage));
  }

  async store(req: Request, res: Response, next: NextFunction) {
    // store data in the database based on the model
  }

  async fetch(req: Request, res: Response, next: NextFunction) {
    const id_or_email = req.params.id_or_email;
    let withBalance = !req.query.withBalance ? true : req.query.withBalance;
    withBalance = withBalance === "true";
    let as = new AccountService(),
      data = await as.find(id_or_email, withBalance),
      balance,
      ret: { account: IAccount; balance?: number };

    ret = {
      account: data,
    };

    if (withBalance) {
      balance = getBalanceFromTransactions(data.transactions);
      ret.balance = balance;
    }

    return res.send(ret);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    // store data in the database based on the model
  }

  async delete() {
    // store data in the database based on the model
  }
}
