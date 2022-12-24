import { EUserStatus } from "../../../../types/user";
import { IUserListenEvents, TUserIO, TUserSocket } from "../../../@types/main";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerUserHandlers(io: TUserIO, socket: TUserSocket) {
  const handle = withErrorHandling<IUserListenEvents>(socket);

  async function onAdminStatus() {
    const sockets = await io.of("admin").fetchSockets();

    const isAnyAdminOnline = sockets.some(
      ({ data }) => data.user.status !== EUserStatus.invisible
    );

    socket.emit("admin:status", { data: isAnyAdminOnline });
  }

  socket.on("admin:status", handle(onAdminStatus, "admin:status"));
}

export default registerUserHandlers;
