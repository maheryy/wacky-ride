import "./style.css";
import "./config";
import { createApp } from "vue";
import App from "./App.vue";
import store, { useAuthStore } from "./stores";
import router from "./router";

const app = createApp(App).use(store);
const auth = useAuthStore();

auth.attempt(localStorage.getItem("token") || "").then(() => {
  app.use(router(auth)).mount("#app");
});
