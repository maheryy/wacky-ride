import { RouteRecordRaw } from "vue-router";
import { TStoreAuth } from "../stores";
import { loginResolver } from "./middlewares";

const getRoutes = (auth: TStoreAuth): RouteRecordRaw[] => {
  return [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
      beforeEnter: (to, from, next) => loginResolver(to, from, next, auth),
    },
  ];
};

export default getRoutes;
