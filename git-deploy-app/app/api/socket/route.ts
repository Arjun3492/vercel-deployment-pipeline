// import { Redis } from "ioredis";
// import { NextApiRequest, NextApiResponse } from "next";
// import { Server as IOServer, Socket } from "socket.io";
// import type { Server as HTTPServer } from 'http'
// import type { Socket as NetSocket } from 'net'


// interface SocketServer extends HTTPServer {
//     io?: IOServer | undefined
// }

// interface SocketWithIO extends NetSocket {
//     server: SocketServer
// }

// interface NextApiRequestWithSocket extends NextApiRequest {
//     socket: SocketWithIO
// }

// interface SocketHandlerProps {
//     req: NextApiRequestWithSocket;
//     res: NextApiResponse;
// }


// export async function GET({ req, res }: SocketHandlerProps) {
//     if (!res.socket) {
//         throw new Error("res.socket is null");
//     }
//     const redisHost = process.env.REDIS_HOST;
//     if (!redisHost) throw new Error("Redis host not assigned in env");

//     const socketWithIO = res.socket as SocketWithIO;
//     if (socketWithIO.server.io) {
//         console.log("socket already running");
//     } else {
//         const io: IOServer = new IOServer(socketWithIO.server);
//         socketWithIO.server.io = io;
//         const subscriber: Redis = new Redis(redisHost);

//         io.on("connection", (socket: Socket) => {
//             console.log("server is connected");
//             socket.on("subscribe", (channel: string) => {
//                 socket.join(channel);
//                 socket.emit("message", `Joined ${channel}`);
//                 subscriber.psubscribe("logs:*");
//                 subscriber.on("pmessage", (pattern: string, channel: string, message: string) => {
//                     io.to(channel).emit("message", message);
//                 });
//             });
//         });
//     }
//     res.end();
// };
export function GET(req: Request) {
    return Response.json({ message: "heoo" })
}
