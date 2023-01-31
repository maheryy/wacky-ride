import { IUserListenEvents, TUserIO, TUserSocket } from "../../../@types/main";
import { isAnyAdminOnline } from "../../../helpers/isAnyAdminOnline";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerUserHandlers(io: TUserIO, socket: TUserSocket) {
  const handle = withErrorHandling<IUserListenEvents>(socket);

  async function onAdminStatus() {
    const isAdminAvailable = await isAnyAdminOnline(io);

    socket.emit("admin:status", {
      data: isAdminAvailable,
    });
  }

  socket.on("admin:status", handle(onAdminStatus, "admin:status"));
}

export default registerUserHandlers;
