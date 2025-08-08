"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@workspace/ui/components/select";
import {
  ListIcon,
  ArrowUp,
  ArrowRight,
  Check,
  CornerUpLeft,
} from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { DicebearAvatar } from "@workspace/ui/components/dicebar-avatar";
import { formatDistanceToNow } from "date-fns";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useAtomValue, useSetAtom } from "jotai/react";
import { statusFilterAtom } from "../../atoms";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Loader } from "@workspace/ui/components/shared/loader";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useState, useTransition } from "react";

const ConversationsPanel = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingConversationId, setLoadingConversationId] = useState<string | null>(null);

  const statuFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);

  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: statuFilter === "all" ? undefined : statuFilter,
    },
    {
      initialNumItems: 10,
    }
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 10,
  });

  const handleConversationClick = (conversationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setLoadingConversationId(conversationId);
    
    startTransition(() => {
      router.push(`/conversations/${conversationId}`);
      // Reset loading state after navigation
      setTimeout(() => {
        setLoadingConversationId(null);
      }, 100);
    });
  };

  return (
    <div className="flex h-full w-full bg-background flex-col text-sidebar-foreground">
      <div className="flex flex-col gap-3.5 border-b p-2.5">
        <Select
          defaultValue="all"
          onValueChange={(value) => {
            setStatusFilter(
              value as "unresolved" | "resolved" | "escalated" | "all"
            );
          }}
          value={statuFilter}
        >
          <SelectTrigger className="!h-8  border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ListIcon className="size-4" />
                <span>All </span>
              </div>
            </SelectItem>
            <SelectItem value="unresolved">
              <div className="flex items-center gap-2">
                <ArrowRight className="size-4" />
                <span>Unresolved </span>
              </div>
            </SelectItem>
            <SelectItem value="escalated">
              <div className="flex items-center gap-2">
                <ArrowUp className="size-4" />
                <span>Escalated </span>
              </div>
            </SelectItem>
            <SelectItem value="resolved">
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <span>Resolved </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoadingFirstPage ? (
        <SkeletonConversations />
      ) : (
        <ScrollArea className="max-h-[calc(100vh-53px)]">
          <div className="flex w-full flex-1 flex-col text-sm">
            {conversations.results.map((conversation) => {
              const isLastMessageFromOperator =
                conversation.lastMessage?.message?.role !== "user";

              const country = getCountryFromTimezone(
                conversation.contactSession.metadata?.timezone
              );

              const countryFlagUrl = country?.code
                ? getCountryFlagUrl(country.code)
                : undefined;

              const isCurrentConversation = pathname === `/conversations/${conversation._id}`;
              const isLoading = loadingConversationId === conversation._id;

              return (
                <div
                  key={conversation._id}
                  onClick={(e) => handleConversationClick(conversation._id, e)}
                  className={cn(
                    "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                    isCurrentConversation && "bg-accent text-accent-foreground",
                    isLoading && "bg-accent/60 pointer-events-none"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity -translate-y-1/2",
                      isCurrentConversation && "opacity-100"
                    )}
                  />

                  <div className="relative">
                    <DicebearAvatar
                      seed={
                        conversation.contactSession._id ||
                        conversation.contactSession.name
                      }
                      size={40}
                      badgeImageUrl={countryFlagUrl}
                      className={cn(
                        "shrink-0 transition-opacity",
                        isLoading && "opacity-50"
                      )}
                    />
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader className="size-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className={cn(
                    "flex-1 transition-opacity",
                    isLoading && "opacity-50"
                  )}>
                    <div className="flex w-full items-center gap-2">
                      <span className="truncate font-semibold">
                        {conversation.contactSession.name}
                      </span>
                      <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                        {formatDistanceToNow(conversation._creationTime)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex w-0 grow items-center gap-1">
                        {isLastMessageFromOperator && (
                          <CornerUpLeft className="size-3 shrink-0 text-muted-foreground" />
                        )}
                        <span
                          className={cn(
                            "line-clamp-1  text-muted-foreground text-xs",
                            !isLastMessageFromOperator &&
                              "font-semibold text-black"
                          )}
                        >
                          {conversation.lastMessage?.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLoading && (
                          <span className="text-xs text-muted-foreground">
                            Loading...
                          </span>
                        )}
                        <ConversationStatusIcon status={conversation.status} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ConversationsPanel;

export const SkeletonConversations = () => {
  return (
    <div className="flex flex-col min-h-0 flex-1 gap-2 overflow-auto">
      <div className="relative w-full min-w-0 flex-col p-2">
        <div className="w-full space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="flex items-start gap-3 rounded-lg p-4" key={index}>
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex w-full items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-3 w-12 shrink-0" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};