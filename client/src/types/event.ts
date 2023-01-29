export enum ServerSentEvent {
  NOTIFICATION = "notification",
}

export interface NotificationPayload {
  message: string;
}
