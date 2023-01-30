import { RouteRecordRaw } from "vue-router";
import { TStoreAuth } from "../stores";
import { authResolver } from "./middlewares";

const getRoutes = (auth: TStoreAuth): RouteRecordRaw[] => {
  const options: Pick<RouteRecordRaw, "beforeEnter"> = {
    beforeEnter: (to, from, next) => authResolver(to, from, next, auth),
  };

  return [
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/Dashboard.vue"),
      ...options,
    },
    {
      path: "/community",
      name: "community",
      component: () => import("../views/Community.vue"),
      ...options,
    },
    {
      path: "/conversations",
      name: "conversations",
      component: () => import("../views/Conversations.vue"),
      ...options,
    },
    {
      path: "/conversation/:conversationId",
      name: "conversation",
      component: () => import("../views/Conversation.vue"),
      props: (route) => ({ conversationId: route.params.conversationId }),
      ...options,
    },
    {
      path: "/chatbot",
      name: "chatbot",
      component: () => import("../views/ChatBot.vue"),
      ...options,
    },
    {
      path: "/rooms",
      name: "rooms",
      component: () => import("../views/ChatRooms.vue"),
      ...options,
    },
    {
      path: "/room/:roomId",
      name: "room",
      component: () => import("../views/ChatRoom.vue"),
      props: (route) => ({ roomId: route.params.roomId }),
      ...options,
    },
  ];
};

export default getRoutes;

