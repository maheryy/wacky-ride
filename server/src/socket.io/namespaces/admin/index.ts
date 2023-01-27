import { getUserById } from "../../../services/user.service";
import { EUserStatus } from "../../../types/user";
import { TAdminIO, TAdminSocket } from "../../@types/admin";
import { authenticate, authorize } from "../../middlewares/auth";
import registerContactHandlers from "./events/contact";
import registerConversationHandlers from "./events/conversation";
import registerRoomHandlers from "./events/room";
import registerUserHandlers from "./events/user";

function registerAdminNamespace(io: TAdminIO) {
  const admin = io.of("/admin");

  admin.use(authenticate);

  admin.use(authorize(true));

  function onConnection(socket: TAdminSocket) {
    const { status: userStatus, id: userId } = socket.data.user;

    console.log("[socket.io]: Admin connected", userId);

    if (userStatus === EUserStatus.online) {
      io.of("/").emit("admin:connected", { data: { userId } });
    }

    registerUserHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerContactHandlers(io, socket);
    registerConversationHandlers(io, socket);

    async function onDisconnect() {
      console.log("[socket.io]: Admin disconnected", userId);

      const user = await getUserById(userId);

      if (user?.status === EUserStatus.online) {
        io.of("/").emit("admin:disconnected", { data: { userId } });
      }
    }

    socket.on("disconnect", onDisconnect);
  }

  admin.on("connection", onConnection);
}

export default registerAdminNamespace;

