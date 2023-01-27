import { App } from "vue";
import Toast, { POSITION, PluginOptions } from "vue-toastification";

const options: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  maxToasts: 3,
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

