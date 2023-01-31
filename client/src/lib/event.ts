import { POSITION, TYPE, useToast } from "vue-toastification";
import { NotificationPayload } from "../types/event";

export const displayAdminNotification = (event: MessageEvent) => {
  if (!event.data) return;

  const toast = useToast();
  const data = JSON.parse(event.data) as NotificationPayload;

  if (!data.message) return;

  toast(data.message, {
    type: TYPE.INFO,
    position: POSITION.TOP_CENTER,
    timeout: 5000,
    hideProgressBar: true,
    draggable: true,
  });
};
