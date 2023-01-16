import {
  RouteRecordRaw,
  Router,
  createRouter,
  createWebHistory,
} from "vue-router";
import { TStoreAuth } from "../stores";
import getPublicRoutes from "./public";
import getProtectedRoutes from "./protected";
import getAdminRoutes from "./admin";

const getRoutes = (auth: TStoreAuth): RouteRecordRaw[] => {
  return [
    ...getPublicRoutes(auth),
    ...getProtectedRoutes(auth),
    ...getAdminRoutes(auth),
    {
      path: "/:pathMatch(.*)",
      name: "not-found",
      component: () => import("../views/errors/NotFound.vue"),
    },
  ];
};

const router = (auth: TStoreAuth): Router => {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: getRoutes(auth),
  });

  // Implementing middleware individually to avoid useless checks on every route change
  // router.beforeEach((to, from, next) => beforeEach(to, from, next, auth));
  // router.beforeResolve((to, from, next) => beforeResolve(to, from, next, auth));

  return router;
};

export default router;
