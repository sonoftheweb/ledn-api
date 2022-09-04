export interface Route {
  controller: string;
  model: string;
  smart: boolean;
}

export interface Routes {
  accounts: Route;
}

export const routeMap: Routes = {
  accounts: {
    controller: "AccountController",
    model: "Account",
    smart: true,
  },
};
