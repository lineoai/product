import Vapi from "@vapi-ai/web";
import { useEffect, useState, useCallback, useRef } from "react";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
  timestamp?: number;
}

interface VapiError {
  message: string;
  code?: string;
}

export const useVapi = (apiKey?: string, assistantId?: string) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<VapiError | null>(null);
  const [volume, setVolume] = useState(0);

  // Use refs to avoid stale closures in event handlers
  const isConnectedRef = useRef(isConnected);
  const isConnectingRef = useRef(isConnecting);

  // Update refs when state changes
  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  useEffect(() => {
    isConnectingRef.current = isConnecting;
  }, [isConnecting]);

  // Default values for testing (move these to environment variables in production)
  const defaultApiKey = apiKey || "266dc214-54ee-4626-8dbd-a6052ec0aa99";
  const defaultAssistantId =
    assistantId || "00b00c58-09ba-4621-8f41-c5ab9f6dad09";

  useEffect(() => {
    if (!defaultApiKey) {
      setError({ message: "Vapi API key is required" });
      return;
    }

    let vapiInstance: Vapi | null = null;

    try {
      vapiInstance = new Vapi(defaultApiKey);
      setVapi(vapiInstance);
      setError(null);

      // Call start event
      vapiInstance.on("call-start", () => {
        console.log("Vapi call started");
        setIsConnected(true);
        setIsConnecting(false);
        setTranscript([]);
        setError(null);
      });

      // Call end event
      vapiInstance.on("call-end", () => {
        console.log("Vapi call ended");
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
        setVolume(0);
      });

      // Speech events
      vapiInstance.on("speech-start", () => {
        console.log("Speech started");
        setIsSpeaking(true);
      });

      vapiInstance.on("speech-end", () => {
        console.log("Speech ended");
        setIsSpeaking(false);
      });

      // Volume events (if supported)
      vapiInstance.on("volume-level", (level: number) => {
        setVolume(level);
      });

      // Error handling
      vapiInstance.on("error", (error: any) => {
        console.error("Vapi error:", error);
        setError({
          message: error?.message || "An unknown error occurred",
          code: error?.code,
        });
        setIsConnecting(false);
        setIsConnected(false);
      });

      // Message handling with better type safety
      vapiInstance.on("message", (message: any) => {
        try {
          if (
            message?.type === "transcript" &&
            message?.transcriptType === "final"
          ) {
            const role = message.role === "user" ? "user" : "assistant";
            const text = message.transcript || "";

            if (text.trim()) {
              setTranscript((prev) => [
                ...prev,
                {
                  role,
                  text: text.trim(),
                  timestamp: Date.now(),
                },
              ]);
            }
          }

          // Handle other message types if needed
          if (message?.type === "function-call") {
            console.log("Function call:", message);
          }
        } catch (err) {
          console.error("Error processing message:", err);
        }
      });
    } catch (err) {
      console.error("Failed to initialize Vapi:", err);
      setError({
        message:
          err instanceof Error ? err.message : "Failed to initialize Vapi",
      });
    }

    // Cleanup function
    return () => {
      if (vapiInstance) {
        try {
          vapiInstance.stop();
          vapiInstance.removeAllListeners();
        } catch (err) {
          console.error("Error during cleanup:", err);
        }
      }
    };
  }, [defaultApiKey]); // Only reinitialize if API key changes

  // Start call function with better error handling
  const startCall = useCallback(
    async (customAssistantId?: string) => {
      if (!vapi) {
        setError({ message: "Vapi not initialized" });
        return;
      }

      if (isConnectedRef.current) {
        console.warn("Call already connected");
        return;
      }

      if (isConnectingRef.current) {
        console.warn("Call already connecting");
        return;
      }

      const assistantToUse = customAssistantId || defaultAssistantId;

      if (!assistantToUse) {
        setError({ message: "Assistant ID is required" });
        return;
      }

      try {
        setIsConnecting(true);
        setError(null);
        console.log("Starting call with assistant:", assistantToUse);

        await vapi.start(assistantToUse);
      } catch (err) {
        console.error("Failed to start call:", err);
        setError({
          message: err instanceof Error ? err.message : "Failed to start call",
        });
        setIsConnecting(false);
      }
    },
    [vapi, defaultAssistantId]
  );

  // End call function with better error handling
  const endCall = useCallback(() => {
    if (!vapi) {
      console.warn("Vapi not initialized");
      return;
    }

    if (!isConnectedRef.current && !isConnectingRef.current) {
      console.warn("No active call to end");
      return;
    }

    try {
      console.log("Ending call");
      vapi.stop();
    } catch (err) {
      console.error("Error ending call:", err);
      setError({
        message: err instanceof Error ? err.message : "Error ending call",
      });
    }
  }, [vapi]);

  // Clear transcript function
  const clearTranscript = useCallback(() => {
    setTranscript([]);
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Send message function (if supported by your Vapi setup)
  const sendMessage = useCallback(
    (message: string) => {
      if (!vapi || !isConnectedRef.current) {
        console.warn("Cannot send message: not connected");
        return;
      }

      try {
        // This depends on your Vapi configuration
        vapi.send({
          type: "add-message",
          message: {
            role: "user",
            content: message,
          },
        });
      } catch (err) {
        console.error("Error sending message:", err);
        setError({
          message: err instanceof Error ? err.message : "Error sending message",
        });
      }
    },
    [vapi]
  );

  return {
    // Core Vapi instance
    vapi,

    // Connection state
    isConnected,
    isConnecting,
    isSpeaking,

    // Data
    transcript,
    volume,
    error,

    // Actions
    startCall,
    endCall,
    clearTranscript,
    clearError,
    sendMessage,

    // Computed values
    canStartCall: !isConnected && !isConnecting && !!vapi,
    canEndCall: (isConnected || isConnecting) && !!vapi,
  };
};
