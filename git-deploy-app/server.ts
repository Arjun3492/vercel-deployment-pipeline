import dotenv from 'dotenv';
dotenv.config();

import { Redis } from 'ioredis';
import { createServer } from "node:http";
import next from "next";
import { Server, Socket } from "socket.io";



const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

const checkENV = () => {
    const requiredEnvVars = {
        REDIS_HOST: "Redis host",
        SUBNET_V1: "Subnets",
        SUBNET_V2: "Subnets",
        SUBNET_V3: "Subnets",
        SECURITY_GROUP: "Security Group",
        AWS_REGION: "AWS Credentials",
        AWS_ACCESS_KEY_ID: "AWS Credentials",
        AWS_SECRET_ACCESS_KEY: "AWS Credentials",
        ECS_CLUSTER_ARN: "ECS Cluster",
        ECS_TASK_ARN: "ECS Task",
        CONTAINER_IMAGE: "Container Image",
    };

    for (const [key, description] of Object.entries(requiredEnvVars)) {
        if (!process.env[key]) {
            console.error(`${description} not assigned in env`);
            process.exit(1);
        }
    }
};
checkENV();
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {

    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Adjust as necessary
        },
    });
    io.on("connection", (socket: Socket) => {
        console.log("server is connected");

        socket.on("subscribe", (channel: string) => {
            console.log("server is subscribing to channel", channel)
            socket.join(channel);
            // socket.emit("message", `Joined ${channel}`);
            const subscriber: Redis = new Redis(process.env.REDIS_HOST as string);

            subscriber.psubscribe("logs:*");
            subscriber.on("pmessage", (pattern: string, channel: string, message: string) => {
                console.log(`Received message: ${message} from channel: ${channel}`);

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