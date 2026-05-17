import React, { useState, useRef, useEffect } from "react";
import { UilCheckCircle, UilMessage, UilSearch, UilArrowLeft } from "@iconscout/react-unicons";
import ls from "localstorage-slim";
import moment from "moment";
import { useChat } from "./../../../../hooks/useChat";
import { httpGetWithToken } from "./../../../../utils/http_utils";


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
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, loading } = useChat(selectedChat?.id ?? null);

  // Fetch chats
  useEffect(() => {
    getChatList();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [text]);

  const getChatList = async () => {
    const resp = await httpGetWithToken("chat");
    if (!resp?.error && resp?.data) {
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
      getChatList();
    } catch (err) {
      console.error("sendMessage failed:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherUserFromChat = (chat: any) => {
    if (!chat) return {};
    if (!chat.user1 || !chat.user2) return {};
    return Number(user.id) === chat.user1.id ? chat.user2 : chat.user1;
  };

  const filteredChats = chatList.filter(chat => {
    const other = otherUserFromChat(chat);
    const name = other?.name ?? "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Main container */}
      <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        
        {/* Sidebar - Always visible on desktop, toggles on mobile */}
        <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-col`}>
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4">Messages</h2>
            <div className="relative">
              <UilSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size="20"
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
                <UilMessage size="48" className="mb-3 opacity-50" />
                <p className="text-sm text-center">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const last =
                  chat.last_message ??
                  (chat.messages && chat.messages[chat.messages.length - 1]);
                const other = otherUserFromChat(chat);
                const isSelected = selectedChat?.id === chat.id;

                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`p-4 cursor-pointer border-b border-gray-100 transition-all duration-200 active:bg-gray-100 ${
                      isSelected
                        ? "bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-l-pink-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 shadow-md">
                        {(other?.name ?? "U").charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {other.name ?? "User"}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {last ? moment(last.created_at).fromNow(true) : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {last?.message ?? "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white min-w-0`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* Back button for mobile */}
                  <button
                    onClick={handleBackToList}
                    className="md:hidden p-2 -ml-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                    aria-label="Back to conversations"
                  >
                    <UilArrowLeft size="24" className="text-gray-600" />
                  </button>
                  
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0">
                    {(otherUserFromChat(selectedChat).name ?? "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-lg truncate">
                      {otherUserFromChat(selectedChat).name ?? "Conversation"}
                    </h3>
                    <p className="text-xs text-gray-500">Active now</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                      <UilMessage size="48" className="mb-3 opacity-50" />
                      <p className="text-sm text-center">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((m: any) => {
                      const messageUserId = normalizeUserId(m.user_id);
                      const currentUserId = normalizeUserId(user.id);
                      const isOwn = messageUserId === currentUserId;

                      return (
                        <div
                          key={m.id || Math.random()}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] ${isOwn ? "order-2" : "order-1"}`}>
                            <div
                              className={`px-4 py-3 rounded-2xl shadow-sm ${
                                isOwn
                                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-sm"
                                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                              }`}
                            >
                              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                {m.message}
                              </p>
                            </div>
                            <div
                              className={`flex items-center gap-1 mt-1.5 px-1 ${
                                isOwn ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span className="text-xs text-gray-400">
                                {moment(m.created_at).format("h:mm A")}
                              </span>
                              {isOwn && (
                                <UilCheckCircle size="14" className="text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 lg:p-4 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100 transition-all">
                      <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-4 py-3 bg-transparent border-none focus:outline-none resize-none max-h-32 text-gray-800 placeholder-gray-400 text-sm"
                        style={{ minHeight: "44px" }}
                        disabled={loading}
                      />
                    </div>

                    <button
                      onClick={handleSend}
                      disabled={!text.trim() || loading}
                      className={`px-5 py-3 rounded-2xl font-medium transition-all duration-200 shadow-md flex items-center gap-2 flex-shrink-0 ${
                        text.trim() && !loading
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="hidden sm:inline">Sending...</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Send</span>
                          <UilMessage size="20" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-white">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6 shadow-lg">
                <UilMessage size="48" className="text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Welcome to Messages
              </h3>
              <p className="text-sm text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantChatBox;