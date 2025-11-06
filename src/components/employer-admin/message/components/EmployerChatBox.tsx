import React, { useEffect, useState, useRef } from "react";
import { UilMessage, UilSearch } from "@iconscout/react-unicons";
import ls from "localstorage-slim";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { httpGetWithToken } from './../../../../utils/http_utils';
import { useChat } from './../../../../hooks/useChat';

const EmployerChatPage: React.FC = () => {
  const user: any = ls.get("wwph_usr", { decrypt: true }) || JSON.parse(localStorage.getItem("wwph_usr") || "{}");
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [text, setText] = useState("");
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location?.state?.chatId) {
      loadChats(location.state.chatId);
    } else {
      loadChats();
    }
  }, []);

  const loadChats = async (openChatId?: number) => {
    const resp = await httpGetWithToken("chat");
    if (!resp?.error && resp?.data) {
      setChats(resp.data);
      if (openChatId) {
        const chat = resp.data.find((c: any) => c.id === openChatId);
        if (chat) setSelectedChat(chat);
      }
    }
  };

  const { messages, sendMessage, loading } = useChat(selectedChat?.id ?? null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const receiver_id = selectedChat
      ? (selectedChat.user1?.id
          ? (selectedChat.user1.id === user.id ? selectedChat.user2.id : selectedChat.user1.id)
          : (selectedChat.user1 === user.id ? selectedChat.user2 : selectedChat.user1))
      : undefined;

    await sendMessage({
      message: text,
      receiver_id,
      chat_id: selectedChat?.id,
    });
    setText("");
    await loadChats();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex mt-28 h-[85vh] mt-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Sidebar */}
      <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
          <div className="relative">
            <UilSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="20" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
              <UilMessage size="48" className="mb-3 opacity-50" />
              <p className="text-sm text-center">No conversations yet</p>
            </div>
          ) : (
            chats.map((chat) => {
              const other = chat.user1 === user.id ? chat.ChatUser ?? chat.user2 : chat.Host ?? chat.user1;
              const last = chat.last_message ?? (chat.messages && chat.messages[chat.messages.length - 1]);
              const isSelected = selectedChat?.id === chat.id;
              
              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 cursor-pointer border-b border-gray-100 transition-all duration-200 ${
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
                        <h4 className="font-semibold text-gray-800 truncate">{other?.name ?? "User"}</h4>
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
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {(selectedChat.user1 === user.id 
                    ? selectedChat.ChatUser?.name 
                    : selectedChat.Host?.name ?? "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {selectedChat.user1 === user.id ? selectedChat.ChatUser?.name : selectedChat.Host?.name}
                  </h3>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 pt-8 bg-gradient-to-b from-gray-50 to-white">
              <div className="max-w-4xl mx-auto space-y-4 mt-4">
                {messages.map((m: any) => {
                  const isOwn = m.user_id === user.id;
                  return (
                    <div
                      key={m.id || Math.random()}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            isOwn
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-sm"
                              : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">{m.message}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1.5 px-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                          <span className="text-xs text-gray-400">
                            {moment(m.created_at).format("h:mm A")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3">
                  <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100 transition-all">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-4 py-3 bg-transparent border-none focus:outline-none resize-none max-h-32 text-gray-800 placeholder-gray-400"
                      style={{ minHeight: '44px' }}
                    />
                  </div>
                  
                  <button
                    onClick={handleSend}
                    disabled={!text.trim() || loading}
                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-md flex items-center gap-2 ${
                      text.trim() && !loading
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span>Send</span>
                    <UilMessage size="20" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-white">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6 shadow-lg">
              <UilMessage size="48" className="text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Welcome to Messages</h3>
            <p className="text-sm text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerChatPage;