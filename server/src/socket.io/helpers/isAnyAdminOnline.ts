import { EUserStatus } from "../../types/user";
import { TUserIO } from "../@types/admin";

export async function isAnyAdminOnline(io: TUserIO) {
  const sockets = await io.of("admin").fetchSockets();

  return sockets.some(({ data }) => data.user.status !== EUserStatus.invisible);
}
