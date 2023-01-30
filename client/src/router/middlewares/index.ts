import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { TStoreAuth } from "../../stores";

export const adminResolver = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  auth: TStoreAuth
) => {
  if (!auth.isAuthenticated) {
    return next({ name: "login" });
  }
  if (!auth.isAdmin) {
    return next({ name: "not-found", params: { pathMatch: to.path.slice(1) } });
  }

  next();
};

export const authResolver = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  auth: TStoreAuth
) => {
  if (!auth.isAuthenticated) {
    return next({ name: "login" });
  }

  next();
};

export const loginResolver = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  auth: TStoreAuth
) => {
  if (auth.isAuthenticated) {
    return next({ name: auth.isAdmin ? "admin" : "home" });
  }

  next();
};

/*

export const beforeEach = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  auth: TStoreAuth
) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: "login" });
  }

  next();
};

export const beforeResolve = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  auth: TStoreAuth
) => {
  if (to.meta.requiresAdmin && !auth.isAdmin()) {
    return next({ name: "not-found", params: { pathMatch: to.path.slice(1) } });
  }

  next();
};
*/

