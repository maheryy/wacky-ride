import "vue-toastification/dist/index.css";
import "./style.css";
import "./config";
import { createApp } from "vue";
import Toast from "./plugins/Toast";
import App from "./App.vue";
import store, { useAuthStore } from "./stores";
import router from "./router";

const app = createApp(App);

app.use(store);
app.use(Toast);

const auth = useAuthStore();

auth.attempt(localStorage.getItem("token") || "").then(() => {
  app.use(router(auth));
  app.mount("#app");
});

