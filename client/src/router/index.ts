import {
  RouteRecordRaw,
  Router,
  createRouter,
  createWebHistory,
} from "vue-router";
import Home from "../components/Home/Home.vue";
import ChatBox from "../components/ChatBox/ChatBox.vue";
import ChatBot from "../components/ChatBot/ChatBot.vue";
import ChatRoom from "../components/ChatRoom/ChatRoom.vue";
import ChatRooms from "../components/ChatRooms/ChatRooms.vue";
import NotFound from "../components/Errors/NotFound.vue";
import Admin from "../components/Admin/Admin.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/protected/Dashboard.vue";
import { beforeEach, beforeResolve, loginResolver } from "./middlewares";
import { TStoreAuth } from "../stores";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: loginResolver,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/chat",
    name: "chat",
    component: ChatBox,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/chatbot",
    name: "chatbot",
    component: ChatBot,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/rooms",
    name: "rooms",
    component: ChatRooms,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/room/:roomId",
    name: "room",
    component: ChatRoom,
    props: (route) => ({ roomId: route.params.roomId }),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/:pathMatch(.*)",
    name: "not-found",
    component: NotFound,
  },
];

const router = (auth: TStoreAuth): Router => {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
  });

  router.beforeEach((to, from, next) => beforeEach(to, from, next, auth));
  router.beforeResolve((to, from, next) => beforeResolve(to, from, next, auth));

  return router;
};

export default router;
