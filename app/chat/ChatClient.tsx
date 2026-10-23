"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  StreamChat,
  type Channel as StreamChannel,
  type Event as StreamEvent,
} from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageComposer,
  Window,
} from "stream-chat-react";

// stream-chat-react v14 stylesheet (the old /v2/ path no longer exists).
import "stream-chat-react/dist/css/index.css";

type SearchUser = {
  id: string;
  name: string;
  username: string | null;
  imageUrl: string;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatTime(value?: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  const days = (now.getTime() - date.getTime()) / 86_400_000;
  if (days < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

function getOtherUser(channel: StreamChannel, myId: string) {
  const members = Object.values(channel.state.members ?? {});
  return members.find((m) => m.user?.id !== myId)?.user;
}

function getPreview(channel: StreamChannel, myId: string) {
  const messages = channel.state.messages ?? [];
  const last = messages.slice(-1)[0];
  if (!last) return "No messages yet. Say hi!";
  if (last.type === "deleted" || last.deleted_at) return "Message deleted";
  const text =
    last.text || (last.attachments?.length ? "Sent an attachment" : "");
  return last.user?.id === myId ? "You: " + text : text;
}

function lastActivity(channel: StreamChannel) {
  return channel.state.last_message_at?.getTime() ?? 0;
}

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                            */
/* -------------------------------------------------------------------------- */

function Avatar({
  src,
  name,
  size = 48,
  online,
}: {
  src?: string | null;
  name: string;
  size?: number;
  online?: boolean;
}) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-full w-full rounded-full object-cover ring-1 ring-white/10"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-semibold text-white"
          style={{ fontSize: size * 0.4 }}
        >
          {initial}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0d0b18] bg-emerald-400" />
      )}
    </div>
  );
}

function ChatRow({
  channel,
  myId,
  active,
  onOpen,
}: {
  channel: StreamChannel;
  myId: string;
  active: boolean;
  onOpen: (channel: StreamChannel) => void;
}) {
  const other = getOtherUser(channel, myId);
  const name = other?.name || other?.id || "Unknown";
  const unread = active ? 0 : channel.countUnread();

  return (
    <button
      type="button"
      onClick={() => onOpen(channel)}
      className={
        "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition active:scale-[0.98] " +
        (active
          ? "bg-violet-500/15 ring-1 ring-violet-400/30"
          : "hover:bg-white/5")
      }
    >
      <Avatar src={other?.image as string | undefined} name={name} online={other?.online} />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className={"truncate text-[15px] " + (unread ? "font-semibold text-white" : "font-medium text-white/90")}>
            {name}
          </p>
          <span className={"shrink-0 text-xs " + (unread ? "text-violet-300" : "text-white/40")}>
            {formatTime(channel.state.last_message_at)}
          </span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className={"truncate text-sm " + (unread ? "text-white/80" : "text-white/45")}>
            {getPreview(channel, myId)}
          </p>
          {unread > 0 && (
            <span className="vc-pop flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-1.5 text-[11px] font-semibold text-white">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function ChatHeader({
  channel,
  myId,
  onBack,
}: {
  channel: StreamChannel;
  myId: string;
  onBack: () => void;
}) {
  const other = getOtherUser(channel, myId);
  const name = other?.name || other?.id || "Unknown";

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-white/[0.02] px-3 py-3 md:px-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to chats"
        className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 active:scale-95 md:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <Avatar src={other?.image as string | undefined} name={name} size={40} online={other?.online} />

      <div className="min-w-0">
        <p className="truncate font-semibold text-white">{name}</p>
        <p className="text-xs text-white/45">
          {other?.online ? (
            <span className="text-emerald-400">Online</span>
          ) : other?.last_active ? (
            "Last seen " + formatTime(other.last_active)
          ) : (
            "Offline"
          )}
        </p>
      </div>
    </header>
  );
}

function EmptyState({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="vc-float flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-[0_0_60px_-10px_rgba(168,85,247,0.8)]">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">Your messages</h3>
        <p className="mx-auto mt-1 max-w-xs text-sm text-white/50">
          Pick a conversation from the list, or find someone new to talk to.
        </p>
      </div>
      <button
        type="button"
        onClick={onNewChat}
        className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110 active:scale-95"
      >
        Start a new chat
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function ChatClient() {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user?.id;

  const [client, setClient] = useState<StreamChat | null>(null);
  const [error, setError] = useState("");

  const [channels, setChannels] = useState<StreamChannel[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeChannel, setActiveChannel] = useState<StreamChannel | null>(null);
  const [, setTick] = useState(0);
  const [filterText, setFilterText] = useState("");

  const [showNewChat, setShowNewChat] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [startingChatWith, setStartingChatWith] = useState<string | null>(null);

  /* ------------------------------ connection ------------------------------ */

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    let cancelled = false;
    let connected: StreamChat | null = null;

    async function connect() {
      try {
        setError("");
        const response = await fetch("/api/chat/token");
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "Unable to get chat token");
        }
        const data = await response.json();
        if (cancelled) return;
        if (!data.apiKey || !data.token || !data.userId) {
          throw new Error("Invalid Stream Chat token response");
        }

        const streamClient = StreamChat.getInstance(data.apiKey);

        if (streamClient.userID && streamClient.userID !== data.userId) {
          await streamClient.disconnectUser();
        }
        if (cancelled) return;

        if (!streamClient.userID) {
          await streamClient.connectUser(
            {
              id: data.userId,
              name: user!.fullName || user!.username || "ViChat User",
              image: user!.imageUrl,
            },
            data.token
          );
        }

        connected = streamClient;
        if (cancelled) {
          await streamClient.disconnectUser();
          return;
        }
        setClient(streamClient);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Chat connection failed");
        }
      }
    }

    void connect();

    return () => {
      cancelled = true;
      if (connected && connected.userID === userId) {
        void connected.disconnectUser();
      }
      setClient(null);
      setChannels([]);
      setActiveChannel(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, userId]);

  /* ----------------------------- conversations ---------------------------- */

  const loadChannels = useCallback(async () => {
    if (!client || !client.userID) return;
    try {
      const result = await client.queryChannels(
        { type: "messaging", members: { $in: [client.userID] } },
        { last_message_at: -1 },
        { state: true, watch: true, presence: true, limit: 30 }
      );
      setChannels(result);
    } catch (err) {
      console.error("Failed to load channels", err);
    } finally {
      setLoadingList(false);
    }
  }, [client]);

  useEffect(() => {
    if (!client) return;
    void loadChannels();

    const structural = [
      "notification.message_new",
      "notification.added_to_channel",
      "notification.removed_from_channel",
      "channel.deleted",
    ];

    const subscription = client.on((event: StreamEvent) => {
      if (structural.includes(event.type)) {
        void loadChannels();
      } else {
        setTick((t) => t + 1); // re-render previews, unread counts, presence
      }
    });

    return () => subscription.unsubscribe();
  }, [client, loadChannels]);

  const sortedChannels = useMemo(
    () => [...channels].sort((a, b) => lastActivity(b) - lastActivity(a)),
    // channels array identity changes on load; tick re-renders cover the rest
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channels, channels.map(lastActivity).join(",")]
  );

  const visibleChannels = sortedChannels.filter((channel) => {
    if (!filterText.trim() || !userId) return true;
    const other = getOtherUser(channel, userId);
    const name = (other?.name || other?.id || "").toLowerCase();
    return name.includes(filterText.trim().toLowerCase());
  });

  const totalUnread = userId
    ? channels.reduce(
        (sum, c) => sum + (c.cid === activeChannel?.cid ? 0 : c.countUnread()),
        0
      )
    : 0;

  /* ------------------------------ user search ----------------------------- */

  useEffect(() => {
    if (!showNewChat || search.trim().length < 2) {
      setUsers([]);
      setSearchError("");
      setSearching(false);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      try {
        setSearching(true);
        setSearchError("");
        const response = await fetch(
          "/api/users/search?q=" + encodeURIComponent(search.trim())
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to search users");
        if (!cancelled) setUsers(data.users ?? []);
      } catch (err) {
        if (!cancelled) {
          setUsers([]);
          setSearchError(err instanceof Error ? err.message : "User search failed");
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, showNewChat]);

  function closeNewChat() {
    setShowNewChat(false);
    setSearch("");
    setUsers([]);
    setSearchError("");
  }

  async function startChat(target: SearchUser) {
    if (!client || !client.userID) {
      setSearchError("Chat is still connecting. Please try again.");
      return;
    }
    try {
      setStartingChatWith(target.id);
      setSearchError("");

      const response = await fetch("/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: target.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start conversation");
      if (!data.channelId) throw new Error("The server did not return a channel ID");

      const channel = client.channel("messaging", data.channelId);
      await channel.watch();

      setChannels((prev) =>
        prev.some((c) => c.cid === channel.cid) ? prev : [channel, ...prev]
      );
      setActiveChannel(channel);
      closeNewChat();
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Unable to start conversation");
    } finally {
      setStartingChatWith(null);
    }
  }

  /* -------------------------------- render -------------------------------- */

  if (!isLoaded) return <p className="p-4 text-white/70">Loading account...</p>;
  if (!isSignedIn || !user) return <p className="p-4 text-white/70">Please sign in to use ViChat.</p>;
  if (error) return <p className="p-4 text-red-400">{error}</p>;
  if (!client || !client.userID) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-white/60">
        <span className="vc-spin h-5 w-5 rounded-full border-2 border-violet-400 border-t-transparent" />
        Connecting to ViChat...
      </div>
    );
  }

  const hasChannel = Boolean(activeChannel);

  return (
    <div className="vichat">
      <style>{css}</style>

      <Chat client={client} theme="str-chat__theme-dark">
        <div className="flex h-full overflow-hidden bg-[#0d0b18] text-white md:rounded-3xl md:border md:border-white/10 md:shadow-2xl md:shadow-violet-950/40">
          {/* ------------------------------ sidebar ----------------------------- */}
          <aside
            className={
              (hasChannel ? "hidden md:flex " : "flex ") +
              "relative w-full shrink-0 flex-col border-r border-white/10 md:w-[22rem]"
            }
          >
            <div className="shrink-0 space-y-3 px-4 pb-3 pt-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Messages</h2>
                  {totalUnread > 0 && (
                    <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-300">
                      {totalUnread} new
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewChat(true)}
                  className="flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 pl-3 pr-4 text-sm font-medium text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110 active:scale-95"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  New chat
                </button>
              </div>

              <input
                type="search"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search your chats"
                className="vc-input"
              />
            </div>

            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-2 pb-3">
              {loadingList &&
                [0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-3">
                    <div className="vc-shimmer h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="vc-shimmer h-3 w-1/2 rounded" />
                      <div className="vc-shimmer h-3 w-3/4 rounded" />
                    </div>
                  </div>
                ))}

              {!loadingList && channels.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="font-medium text-white/80">No conversations yet</p>
                  <p className="mt-1 text-sm text-white/45">
                    Tap New chat to message someone.
                  </p>
                </div>
              )}

              {!loadingList && channels.length > 0 && visibleChannels.length === 0 && (
                <p className="px-6 py-10 text-center text-sm text-white/45">
                  No chats match &ldquo;{filterText}&rdquo;.
                </p>
              )}

              {visibleChannels.map((channel) => (
                <ChatRow
                  key={channel.cid}
                  channel={channel}
                  myId={user.id}
                  active={channel.cid === activeChannel?.cid}
                  onOpen={setActiveChannel}
                />
              ))}
            </div>

            {/* ------------------------- new chat sheet ------------------------- */}
            {showNewChat && (
              <div className="vc-sheet absolute inset-0 z-20 flex flex-col bg-[#0d0b18]">
                <div className="flex items-center gap-2 px-3 pb-3 pt-4">
                  <button
                    type="button"
                    onClick={closeNewChat}
                    aria-label="Close"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 active:scale-95"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-semibold">New message</h2>
                </div>

                <div className="px-4 pb-3">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search people by name or username"
                    className="vc-input"
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
                  {search.trim().length < 2 && (
                    <p className="px-4 py-8 text-center text-sm text-white/45">
                      Type at least 2 letters to find someone.
                    </p>
                  )}
                  {searching && (
                    <p className="px-4 py-4 text-center text-sm text-white/50">Searching...</p>
                  )}
                  {searchError && (
                    <p className="px-4 py-4 text-center text-sm text-red-400">{searchError}</p>
                  )}
                  {!searching && search.trim().length >= 2 && !searchError && users.length === 0 && (
                    <p className="px-4 py-8 text-center text-sm text-white/45">
                      No one found. Try a different name.
                    </p>
                  )}

                  {users.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      disabled={startingChatWith !== null}
                      onClick={() => void startChat(person)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white/5 active:scale-[0.98] disabled:opacity-50"
                    >
                      <Avatar src={person.imageUrl} name={person.name} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{person.name}</p>
                        {person.username && (
                          <p className="truncate text-sm text-white/45">@{person.username}</p>
                        )}
                      </div>
                      <span className="shrink-0 rounded-full bg-violet-500/20 px-3 py-1.5 text-xs font-medium text-violet-200">
                        {startingChatWith === person.id ? "Opening..." : "Message"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ----------------------------- conversation ---------------------------- */}
          <main
            className={
              (hasChannel ? "flex " : "hidden md:flex ") + "min-w-0 flex-1 flex-col"
            }
          >
            {activeChannel ? (
              <div key={activeChannel.cid} className="vc-enter flex h-full min-h-0 flex-col">
                <ChatHeader
                  channel={activeChannel}
                  myId={user.id}
                  onBack={() => setActiveChannel(null)}
                />
                <div className="min-h-0 flex-1">
                  <Channel channel={activeChannel}>
                    <Window>
                      <MessageList />
                      <MessageComposer />
                    </Window>
                  </Channel>
                </div>
              </div>
            ) : (
              <EmptyState onNewChat={() => setShowNewChat(true)} />
            )}
          </main>
        </div>
      </Chat>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                     */
/* -------------------------------------------------------------------------- */

const css = `
/* Height: adjust the subtracted value to match your navbar + page heading. */
.vichat { height: max(520px, calc(100dvh - 11.5rem)); }
@media (min-width: 768px) { .vichat { height: max(560px, calc(100dvh - 10rem)); } }

.vichat .vc-input {
  width: 100%; min-height: 44px; border-radius: 9999px; padding: 0 16px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
  color: #fff; font-size: 16px; outline: none; transition: border-color .15s, background .15s;
}
.vichat .vc-input::placeholder { color: rgba(255,255,255,0.4); }
.vichat .vc-input:focus { border-color: rgba(167,139,250,0.7); background: rgba(255,255,255,0.09); }

/* Stream: let it fill our panel and match the ViChat palette */
.vichat .str-chat { height: 100%; background: transparent; color: #fff;
  --str-chat__primary-color: #a78bfa;
  --str-chat__active-primary-color: #8b5cf6;
  --str-chat__own-message-bubble-background-color: #7c3aed;
  --str-chat__own-message-bubble-color: #ffffff;
}
.vichat .str-chat__channel,
.vichat .str-chat__main-panel,
.vichat .str-chat__container { height: 100%; background: transparent; }
.vichat .str-chat textarea { font-size: 16px; }

@keyframes vc-enter { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
@keyframes vc-sheet { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes vc-pop { 0% { transform: scale(.6); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
@keyframes vc-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes vc-spin { to { transform: rotate(360deg); } }
@keyframes vc-shimmer { 0% { opacity: .35; } 50% { opacity: .7; } 100% { opacity: .35; } }

.vichat .vc-enter { animation: vc-enter .25s ease-out; }
.vichat .vc-sheet { animation: vc-sheet .22s ease-out; }
.vichat .vc-pop { animation: vc-pop .3s ease-out; }
.vichat .vc-float { animation: vc-float 4s ease-in-out infinite; }
.vichat .vc-spin, .vc-spin { animation: vc-spin .8s linear infinite; }
.vichat .vc-shimmer { background: rgba(255,255,255,0.08); animation: vc-shimmer 1.4s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .vichat .vc-enter, .vichat .vc-sheet, .vichat .vc-pop, .vichat .vc-float, .vichat .vc-shimmer { animation: none; }
}
`;