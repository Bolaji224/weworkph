import React, { useEffect, useState, useRef } from "react";
import { UilMessage } from "@iconscout/react-unicons";
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

  // If navigated with state { chatId }, open that chat
  useEffect(() => {
    if (location?.state?.chatId) {
      loadChats(location.state.chatId);
    } else {
      loadChats();
    }
    // eslint-disable-next-line
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
    // if selectedChat exists, receiver is the other user; if not, we must supply receiver_id when calling sendMessage
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
    await loadChats(); // refresh list to include updated last_message
  };

  return (
    <div className="flex h-[80vh] bg-white rounded-lg shadow overflow-hidden">
      <div className="w-1/3 border-r overflow-y-auto p-4">
        <h3 className="font-semibold mb-3">Chats</h3>
        {chats.map((chat) => {
          const other = chat.user1 === user.id ? chat.ChatUser ?? chat.user2 : chat.Host ?? chat.user1;
          const last = chat.last_message ?? (chat.messages && chat.messages[chat.messages.length - 1]);
          return (
            <div key={chat.id} onClick={() => setSelectedChat(chat)} className={`p-3 cursor-pointer border-b ${selectedChat?.id === chat.id ? "bg-pink-50" : "hover:bg-pink-50"}`}>
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{other?.name ?? "User"}</div>
                  <div className="text-xs text-gray-500 truncate">{last?.message ?? "No messages"}</div>
                </div>
                <div className="text-xs text-gray-400">{last ? moment(last.created_at).format("Do, MMM") : ""}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b font-semibold">{selectedChat.user1 === user.id ? selectedChat.ChatUser?.name : selectedChat.Host?.name}</div>
            <div className="flex-1 overflow-auto p-4">
              {messages.map((m: any) => (
                <div key={m.id || Math.random()} className={`my-2 flex ${m.user_id === user.id ? "justify-end" : "justify-start"}`}>
                  <div className={`p-2 rounded-lg max-w-xs ${m.user_id === user.id ? "bg-pink-500 text-white" : "bg-gray-200"}`}>
                    {m.message}
                    <div className="text-xs text-gray-400 mt-1">{moment(m.created_at).format("Do, MMM | h:mm a")}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t flex items-center gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 border rounded p-2" placeholder="Type a message..." />
              <button onClick={handleSend} className="ml-2 bg-pink-500 text-white px-4 py-2 rounded">
                Send <UilMessage />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a chat to start</div>
        )}
      </div>
    </div>
  );
};

export default EmployerChatPage;
