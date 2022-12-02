import { Server, Socket } from "socket.io";
import { authentication } from "../../middlewares/auth";
import registerUserHandlers from "./events/user";

function registerAdminNamespace(io: Server) {
  const admin = io.of("/admin");

  admin.use(authentication.socketIO);

  function onConnection(socket: Socket) {
    console.log("[socket.io]: Admin connected", socket.request.user?.id);

    registerUserHandlers(io, socket);
  }

  admin.on("connection", onConnection);
}

export default registerAdminNamespace;
