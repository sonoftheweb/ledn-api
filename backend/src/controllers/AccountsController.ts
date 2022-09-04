import { BaseController } from "./BaseController";
import { NextFunction, Request, Response } from "express";

export class AccountsController extends BaseController {
  async index(req: Request, res: Response, next: NextFunction) {
    return res.send("I am index");
  }
}
