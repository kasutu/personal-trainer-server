import { Server } from "socket.io";

export abstract class SilidSocket {
  public static io: Server;
}

export const socket = SilidSocket.io;
