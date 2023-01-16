import { RouteRecordRaw } from "vue-router";
import { TStoreAuth } from "../stores";
import { adminResolver } from "./middlewares";

const getRoutes = (auth: TStoreAuth): RouteRecordRaw[] => {
  const options: Pick<RouteRecordRaw, "beforeEnter"> = {
    beforeEnter: (to, from, next) => adminResolver(to, from, next, auth),
  };

  return [
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/admin/Admin.vue"),
      ...options,
    },
  ];
};

export default getRoutes;
