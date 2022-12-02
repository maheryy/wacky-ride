import { updateUser } from "../../../services/user.service";
import { TUserIO, TUserSocket } from "../../../types/socket.io/admin";
import { IUser } from "../../../types/user";

function registerUserHandlers(_io: TUserIO, socket: TUserSocket) {
  async function onStatusUpdate(status: IUser["status"]) {
    console.log("[socket.io]: Status update", status);

    const { id } = <IUser>socket.request.user;

    updateUser(id, { status });
  }

  socket.on("user-status:update", onStatusUpdate);
}

export default registerUserHandlers;
