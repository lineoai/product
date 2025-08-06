"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight, Loader, MessageSquareText } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { id } from "zod/v4/locales";
import { useState } from "react";
import WidgetFooter from "../components/widget-footer";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessgae = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const [isPendingConversation, setIsPendingConversation] = useState(false);

  const createConversation = useMutation(api.public.conversations.create);

  const handleNewConversations = async () => {
    if (!organizationId) {
      setScreen("error");
      setErrorMessgae("Missing Organization ID");
      return;
    }

    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    setIsPendingConversation(true);
    try {
      const conversationsId = await createConversation({
        contactSessionId,
        organizationId,
      });
      setConversationId(conversationsId);
      setScreen("chat");
    } catch {
      setScreen("error");
    } finally {
      setIsPendingConversation(false);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-col flex-1 p-4 gap-y-4 overflow-y-auto">
        <Button
          className="!h-16 w-full justify-between !rounded-lg"
          variant={"outline"}
          onClick={handleNewConversations}
          disabled={isPendingConversation}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareText className="size-4" />
            {isPendingConversation ? (
              <span>Starting Chat</span>
            ) : (
              <span>Start Chat</span>
            )}
          </div>
          {isPendingConversation ? (
            <Loader className="size-4 animate-spin shrink-0" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>
      </div>
      <WidgetFooter />
    </>
  );
};
