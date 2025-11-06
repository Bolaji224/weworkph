// src/components/candidate-admin/message/components/ApplicantChatBox.tsx
import React, { useState, useRef, useEffect } from "react";
import { UilMessage } from "@iconscout/react-unicons";
import ls from "localstorage-slim";
import moment from "moment";
import { useChat } from "./../../../../hooks/useChat";
import { httpGetWithToken } from "./../../../../utils/http_utils";

const defaultAvatar = "/default-avatar.png";

// normalize user_id to number
function normalizeUserId(raw: any): number | null {
  if (raw == null) return null;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof raw === "object" && "id" in raw) {
    const n = Number(raw.id);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

const ApplicantChatBox: React.FC = () => {
  const user: any =
    ls.get("wwph_usr", { decrypt: true }) ||
    JSON.parse(localStorage.getItem("wwph_usr") || "{}");

  const [chatList, setChatList] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage, loading } = useChat(selectedChat?.id ?? null);

  // Fetch chats
  useEffect(() => {
    getChatList();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getChatList = async () => {
    const resp = await httpGetWithToken("chat");
    if (!resp?.error && resp?.data) {
      // normalize to array
      const chatsArray = Array.isArray(resp.data) ? resp.data : [resp.data];
      setChatList(chatsArray);
    }
  };

  const handleSend = async () => {
    if (!selectedChat || !text.trim() || loading) return;

    const receiver_id =
      Number(user.id) === selectedChat.user1?.id
        ? selectedChat.user2?.id
        : selectedChat.user1?.id;

    try {
      await sendMessage({
        message: text.trim(),
        receiver_id,
        chat_id: selectedChat.id,
      });
      setText("");
      await getChatList(); // refresh last_message
    } catch (err) {
      console.error("sendMessage failed:", err);
    }
  };

  // Safely get the "other" user
  const otherUserFromChat = (chat: any) => {
    if (!chat) return {};
    if (!chat.user1 || !chat.user2) return {};
    return Number(user.id) === chat.user1.id ? chat.user2 : chat.user1;
  };

  return (
    <section className="px-2 py-4 max-w-full mx-auto">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg min-h-[400px]">
        {/* Chat List */}
        <div className="w-full md:w-1/4 border-r p-3 overflow-y-auto">
          <h3 className="font-semibold mb-3">Chats</h3>
          <ul>
            {chatList.map((chat) => {
              const last =
                chat.last_message ??
                (chat.messages && chat.messages[chat.messages.length - 1]);
              const other = otherUserFromChat(chat);
              return (
                <li
                  key={chat.id}
                  className={`p-2 cursor-pointer rounded-md ${
                    selectedChat?.id === chat.id ? "bg-pink-50" : "hover:bg-pink-50"
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={other.avatar ?? defaultAvatar}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={other.name ?? "User"}
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-sm">{other.name ?? "User"}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[140px]">
                          {last?.message ?? "No messages"}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {last ? moment(last.created_at).format("Do, MMM") : ""}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col p-3">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-3 border-b font-semibold">
                {otherUserFromChat(selectedChat).name ?? "Conversation"}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-auto p-4">
                <div className="flex flex-col gap-3">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400">No messages yet</div>
                  )}

                  {messages.map((m: any) => {
                    const messageUserId = normalizeUserId(m.user_id);
                    const currentUserId = normalizeUserId(user.id);
                    const isMe = messageUserId === currentUserId;

                    const avatar = isMe
                      ? user.avatar ?? defaultAvatar
                      : otherUserFromChat(selectedChat).avatar ?? defaultAvatar;

                    return (
                      <div
                        key={m.id ?? Math.random()}
                        className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        {!isMe && (
                          <img
                            src={avatar}
                            alt="other"
                            className="w-7 h-7 rounded-full object-cover mt-1"
                          />
                        )}

                        <div
                          className={`relative p-3 rounded-2xl max-w-[72%] break-words shadow-md ${
                            isMe
                              ? "bg-[#ee009d] text-white rounded-tr-none"
                              : "bg-gray-100 text-gray-900 rounded-tl-none"
                          }`}
                        >
                          <div className="text-sm leading-snug">{m.message}</div>
                          <div
                            className={`text-[10px] mt-1 ${isMe ? "text-pink-100" : "text-gray-500"}`}
                          >
                            {m.created_at ? moment(m.created_at).format("h:mm a") : ""}
                          </div>

                          <div
                            className={`absolute bottom-0 ${
                              isMe
                                ? "-right-2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-[#ee009d]"
                                : "-left-2 w-0 h-0 border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-100"
                            }`}
                            aria-hidden
                          />
                        </div>

                        {isMe && (
                          <img
                            src={avatar}
                            alt="me"
                            className="w-7 h-7 rounded-full object-cover mt-1"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-3 flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full p-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="ml-2 bg-[#ee009d] hover:bg-[#d1008c] transition text-white px-4 py-2 rounded-full flex items-center gap-1 disabled:opacity-60"
                >
                  Send <UilMessage size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApplicantChatBox;
