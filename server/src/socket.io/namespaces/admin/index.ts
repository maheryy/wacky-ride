import { Server, Socket } from "socket.io";
import { authenticate, authorize } from "../../middlewares/auth";
import registerUserHandlers from "./events/user";

function registerAdminNamespace(io: Server) {
  const admin = io.of("/admin");

  admin.use(authenticate);

  admin.use(authorize);

  function onConnection(socket: Socket) {
    console.log("[socket.io]: Admin connected", socket.request.user?.id);

    registerUserHandlers(io, socket);
  }

  admin.on("connection", onConnection);
}

export default registerAdminNamespace;
