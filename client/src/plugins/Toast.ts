import { App } from "vue";
import Toast, { POSITION, PluginOptions } from "vue-toastification";

const options: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  maxToasts: 3,
  timeout: 3000,
  hideProgressBar: true,
  pauseOnFocusLoss: false,
  filterBeforeCreate: (toast, toasts) => {
    const isDuplicate = toasts.some(({ content }) => toast.content === content);

    if (isDuplicate) {
      return false;
    }

    return toast;
  },
};

export default {
  install(app: App<Element>) {
    app.use(Toast, options);
  },
};

