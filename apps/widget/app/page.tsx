"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useVapi } from "@/modules/hooks/use-vapi";

export default function Page() {
  const {
    vapi,
    isSpeaking,
    isConnected,
    isConnecting,
    transcript,
    startCall,
    endCall,
  } = useVapi();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-full gap-4">
      <Button onClick={() => startCall()}>Start Call</Button>
      <Button onClick={endCall} variant={"destructive"}>
        End Call
      </Button>
      <p>isConnected : {`${isConnected}`}</p>
      <p>isConnecting : {`${isConnecting}`}</p>
      <p>isSpeaking : {`${isSpeaking}`}</p>
      <p>transcript : {JSON.stringify(transcript, null, 2)}</p>
    </div>
  );
}
