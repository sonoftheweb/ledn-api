import { routeMap, Route } from "./route-map";
import { Express, NextFunction, Request, Response } from "express";
import { capitalizeFirstLetter } from "../../helpers/string-helpers";

export const initRoutes = (app: Express) => {
  Object.keys(routeMap).map(async (item: string) => {
    let route: Route;
    // @ts-ignore
    route = routeMap[item];
    let CONTROLLER = `./../../controllers/${capitalizeFirstLetter(
        item
      )}Controller`,
      IMPORTED_CONTROLLER = await import(CONTROLLER),
      IMPORTED_CLASS = new IMPORTED_CONTROLLER[
        `${capitalizeFirstLetter(item)}Controller`
      ](route.model, route.smart);

    app.get(`/api/v1/${item}`, IMPORTED_CLASS.index);
    app.get(`/api/v1/${item}/:id`, IMPORTED_CLASS.fetch);
    app.post(`/api/v1/${item}`, IMPORTED_CLASS.store);
    app.put(`/api/v1/${item}/:id`, IMPORTED_CLASS.update);
    app.delete(`/api/v1/${item}/:id`, IMPORTED_CLASS.delete);
  });

  defaultRoutes(app);
};

const defaultRoutes = (app: Express) => {
  app.get(`/`, (req: Request, res: Response, next: NextFunction) => {
    return res.send("Nothing to see here... Please go on along!");
  });
};
