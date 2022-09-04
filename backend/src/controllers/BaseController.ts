import { NextFunction, Request, Response } from "express";

interface HttpMethodsMap {
  index(req: Request, res: Response, next: NextFunction): any;
  store(req: Request, res: Response, next: NextFunction): any;
  fetch(req: Request, res: Response, next: NextFunction): any;
  update(req: Request, res: Response, next: NextFunction): any;
  delete(req: Request, res: Response, next: NextFunction): any;
}

export class BaseController implements HttpMethodsMap {
  model: string | null = null;
  smart: boolean = false;

  constructor(model: string, smart: boolean) {
    this.model = model;
    this.smart = smart;
  }

  async index(req: Request, res: Response, next: NextFunction) {
    return res.send("I am index");
  }

  async store(req: Request, res: Response, next: NextFunction) {
    // store data in the database based on the model
  }

  async fetch(req: Request, res: Response, next: NextFunction) {
    // store data in the database based on the model
  }

  async update(req: Request, res: Response, next: NextFunction) {
    // store data in the database based on the model
  }

  async delete() {
    // store data in the database based on the model
  }
}
