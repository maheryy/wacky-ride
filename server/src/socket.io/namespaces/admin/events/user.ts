import { updateUser } from "../../../../services/user.service";
import { IUser } from "../../../../types/user";
import { IUserEmitEvents, TUserIO, TUserSocket } from "../../../@types/admin";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerUserHandlers(_io: TUserIO, socket: TUserSocket) {
  const handle = withErrorHandling<IUserEmitEvents, TUserSocket>(socket);

  async function onStatusUpdate(status: IUser["status"]) {
    console.log("[socket.io]: Status update", status);

    const { id } = <IUser>socket.request.user;

    const user = await updateUser(id, { status });

    socket.emit("user-status:updated", user.status);
  }

  socket.on(
    "user-status:update",
    handle(onStatusUpdate, "user-status:updated")
  );
}

export default registerUserHandlers;
