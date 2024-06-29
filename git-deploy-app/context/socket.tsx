"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// We're defining the shape of the SocketContext value
interface SocketContextType {
  socket: Socket | null;
}

// We're creating a context to store the socket instance
const SocketContext = createContext<SocketContextType>({ socket: null });

// This hook retrieves the socket instance from the context
export const useSocket = () => {
  // We're getting the socket instance from the context
  const { socket } = useContext(SocketContext);
  return socket;
};

// This provider component wraps the app and provides the socket instance
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // We're initializing the socket state to null
  const [socket, setSocket] = useState<Socket | null>(null);

  // We're establishing a new socket connection when the component mounts
  useEffect(() => {
    // We're creating a new socket connection
    const connection = io();
    console.log("socket connection", connection);
    // We're updating the socket state with the new connection
    setSocket(connection);
  }, []);

  // We're setting up an event listener for connect errors
  useEffect(() => {
    // We're only setting up the event listener if the socket is not null
    if (socket) {
      // We're listening for connect errors and retrying the connection
      socket.on("connect_error", async (err) => {
        console.log("Error establishing socket", err);
        // We're retrying the connection by fetching the socket API
        await fetch("/api/socket");
      });
    }
  }, [socket]);

  // We're providing the socket instance to the wrapped components
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
