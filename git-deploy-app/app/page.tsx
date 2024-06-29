"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { Fira_Code } from "next/font/google";
import axios from "axios";
import { useSocket } from "@/context/socket";

// Importing the Fira Code font for code blocks
const firaCode = Fira_Code({ subsets: ["latin"] });
export default function Home() {
  // State variables for the repo URL, logs, loading state, project ID, and deploy preview URL
  const [repoURL, setURL] = useState<string>("");

  const [logs, setLogs] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [projectId, setProjectId] = useState<string | undefined>();
  const [deployPreviewURL, setDeployPreviewURL] = useState<
    string | undefined
  >();

  // Getting the socket instance from the context
  const socket = useSocket();

  // Ref for the log container element
  const logContainerRef = useRef<HTMLElement>(null);

  // Memoized function to validate the repo URL
  const isValidURL: [boolean, string | null] = useMemo(() => {
    // If the URL is empty, return an invalid state
    if (!repoURL || repoURL.trim() === "") return [false, null];
    // Using a regex to validate the URL format
    const regex = new RegExp(
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/
    );
    return [regex.test(repoURL), "Enter valid Github Repository URL"];
  }, [repoURL]);

  // Callback function to handle the deploy button click
  const handleClickDeploy = useCallback(async () => {
    // Set loading state to true
    setLoading(true);

    // Make a POST request to the API to create a new project
    const { data } = await axios.post(`/api/project`, {
      gitURL: repoURL,
      slug: projectId,
    });

    // If the response is successful, update the project ID and deploy preview URL
    if (data && data.data) {
      const { projectSlug, url } = data.data;
      setProjectId(projectSlug);
      setDeployPreviewURL(url);

      // Subscribe to logs for the project using the socket
      console.log(`Subscribing to logs:${projectSlug}`);
      if (socket) socket.emit("subscribe", `logs:${projectSlug}`);
    }
  }, [projectId, socket, repoURL]);

  // Callback function to handle incoming socket messages
  const handleSocketIncomingMessage = useCallback((message: string) => {
    console.log(`[Incoming Socket Message]:`, typeof message, message);
    const { log } = JSON.parse(message);
    // Update the logs state with the new log message
    setLogs((prev) => [...prev, log]);
    // Scroll to the bottom of the log container
    logContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Effect to set up the socket event listener
  useEffect(() => {
    if (!socket) return;
    // Listen for incoming messages on the socket
    socket.on("message", handleSocketIncomingMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("message", handleSocketIncomingMessage);
    };
  }, [handleSocketIncomingMessage, socket]);

  // Render the UI components
  return (
    <main className="flex justify-center items-center h-[100vh]">
      <div className="w-[600px]">
        <span className="flex justify-start items-center gap-2">
          <Github className="text-5xl" />
          <Input
            disabled={loading}
            value={repoURL}
            onChange={(e) => setURL(e.target.value)}
            type="url"
            placeholder="Github URL"
          />
        </span>
        <Button
          onClick={handleClickDeploy}
          disabled={!isValidURL[0] || loading}
          className="w-full mt-3"
        >
          {loading ? "In Progress" : "Deploy"}
        </Button>
        {deployPreviewURL && (
          <div className="mt-2 bg-slate-900 py-4 px-2 rounded-lg">
            <p>
              Preview URL{" "}
              <a
                target="_blank"
                className="text-sky-400 bg-sky-950 px-3 py-2 rounded-lg"
                href={deployPreviewURL}
              >
                {deployPreviewURL}
              </a>
            </p>
          </div>
        )}
        {logs.length > 0 && (
          <div
            className={`${firaCode.className} text-sm text-green-500 logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-y-auto`}
          >
            <pre className="flex flex-col gap-1">
              {logs.map((log, i) => (
                <code
                  ref={logs.length - 1 === i ? logContainerRef : undefined}
                  key={i}
                >{`> ${log}`}</code>
              ))}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
