import { Redis } from 'ioredis';
import { createServer } from "node:http";
import next from "next";
import { Server, Socket } from "socket.io";
import dotenv from 'dotenv';

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const redisHost = process.env.REDIS_HOST;
if (!redisHost) {
    console.error("Redis host not assigned in env")
    process.exit(1);
}
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {

    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket: Socket) => {
        console.log("server is connected");
        socket.on("subscribe", (channel: string) => {
            socket.join(channel);
            socket.emit("message", `Joined ${channel}`);
            const subscriber: Redis = new Redis(redisHost);

            subscriber.psubscribe("logs:*");
            subscriber.on("pmessage", (pattern: string, channel: string, message: string) => {
                io.to(channel).emit("message", message);
            });
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});