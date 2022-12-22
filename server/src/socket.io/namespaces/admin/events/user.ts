import { getUserById, updateUser } from "../../../../services/user.service";
import { EUserStatus, IUser } from "../../../../types/user";
import { TUserEmitEvents, TUserIO, TUserSocket } from "../../../@types/admin";
import { WackyRideError } from "../../../errors/WackyRideError";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerUserHandlers(io: TUserIO, socket: TUserSocket) {
  const handle = withErrorHandling<TUserEmitEvents>(socket);

  async function onStatusUpdate(status: IUser["status"]) {
    console.log("[socket.io]: Status update", status);

    const user = await getUserById(socket.request.user.id);

    if (!user) {
      throw new WackyRideError("User not found");
    }

    const { id: userId, status: currentUserStatus } = user;

    await updateUser(userId, { status });

    socket.emit("admin:status:updated", { data: { status } });

    const isStatusChanged = currentUserStatus !== status;

    if (!isStatusChanged) {
      return;
    }

    if (status === EUserStatus.invisible) {
      return io.of("/").emit("admin:disconnected", {
        data: { userId },
      });
    }

    if (currentUserStatus === EUserStatus.invisible) {
      return io.of("/").emit("admin:connected", {
        data: { userId },
      });
    }
  }

  socket.on(
    "admin:status:update",
    handle(onStatusUpdate, "admin:status:updated")
  );
}

export default registerUserHandlers;
