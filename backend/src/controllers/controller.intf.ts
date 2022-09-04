import { NextFunction, Request, Response } from "express";

export interface HttpMethodsMap {
  index(req: Request, res: Response, next: NextFunction): any;
  store(req: Request, res: Response, next: NextFunction): any;
  fetch(req: Request, res: Response, next: NextFunction): any;
  update(req: Request, res: Response, next: NextFunction): any;
  delete(req: Request, res: Response, next: NextFunction): any;
}
