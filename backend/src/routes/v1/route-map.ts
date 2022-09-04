export interface Route {
  controller: string;
}

export interface Routes {
  accounts: Route;
}

export const routeMap: Routes = {
  accounts: {
    controller: "AccountController",
  },
};
