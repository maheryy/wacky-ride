import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home/Home.vue";
import ChatBox from "../components/ChatBox/ChatBox.vue";
import ChatBot from "../components/ChatBot/ChatBot.vue";
import ChatRoom from "../components/ChatRoom/ChatRoom.vue";
import ChatRooms from "../components/ChatRooms/ChatRooms.vue";
import NotFound from "../components/Errors/NotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatBox,
    },
    {
      path: "/chatbot",
      name: "chatbot",
      component: ChatBot,
    },
    {
      path: "/rooms",
      name: "rooms",
      component: ChatRooms,
    },
    {
      path: "/room/:roomId",
      name: "room",
      component: ChatRoom,
      props: (route) => ({ roomId: route.params.roomId }),
    },
    {
      path: "/:pathMatch(.*)",
      name: "not-found",
      component: NotFound,
    },
  ],
});

export default router;
