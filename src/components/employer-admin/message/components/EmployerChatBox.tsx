import { UilImage, UilMessage, UilPaperclip } from '@iconscout/react-unicons';
import React, { useState, useEffect, useRef } from 'react';
import Images from '../../../constant/Images';
import { httpPostWithToken } from '../../../../utils/http_utils';
import { echo } from '../../../../utils/echo';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  dateTime: string;
  image?: string;
}

interface ChatUser {
  id: number;
  name: string;
  profileImage: string;
}

const EmployerChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([
    // 💡 For testing, you can hardcode one candidate user
    { id: 2, name: 'Test Candidate', profileImage: Images.ProfileImage },
  ]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** ✅ Handle sending message through backend */
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedUser) return;

    // Show immediately on UI
    const localMsg: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      dateTime: new Date().toLocaleString(),
    };
    setMessages((prev) => [...prev, localMsg]);
    setNewMessage('');

    try {
      const response = await httpPostWithToken('chat/send-chat', {
        message: newMessage,
        user_id: selectedUser.id, // 👈 backend needs this to know who you're chatting with
      });

      if (response?.data?.data?.id) {
        setChatId(response.data.data.id);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  /** ✅ Listen for new messages from Laravel Echo */
  useEffect(() => {
    if (!chatId) return;

    const channel = echo.private(`chat.${chatId}`);

    channel.listen('MessageSent', (event: any) => {
      console.log('Received broadcast:', event);

      const incomingMsg: Message = {
        id: event.message.id,
        text: event.message.message,
        sender: 'bot',
        dateTime: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, incomingMsg]);
    });

    return () => {
      echo.leave(`chat.${chatId}`);
    };
  }, [chatId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const message: Message = {
        id: Date.now(),
        text: `File uploaded: ${files[0].name}`,
        sender: 'user',
        dateTime: new Date().toLocaleString(),
      };
      setMessages([...messages, message]);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      const message: Message = {
        id: Date.now(),
        text: '',
        sender: 'user',
        dateTime: new Date().toLocaleString(),
        image: imageUrl,
      };
      setMessages([...messages, message]);
    }
  };

  const getLastMessage = (userId: number) => {
    const userMessages = messages.filter(
      (msg) => msg.sender === 'user' && selectedUser?.id === userId
    );
    return userMessages.length > 0
      ? userMessages[userMessages.length - 1]
      : null;
  };

  return (
    <section className="px-2 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] mx-auto">
      <h2 className="text-[#2aa100] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-4 sm:mb-6 md:mb-8">
        Message
      </h2>
      <div className="flex flex-col md:flex-row w-full bg-white rounded-lg shadow-lg">
        {/* Chat List Section */}
        <div className="w-full md:w-1/4 border-r-0 md:border-r-2 p-2 sm:p-4">
          <h2 className="text-lg font-bold mb-2 sm:mb-4">Chats</h2>
          <ul>
            {chatUsers.map((user) => {
              const lastMessage = getLastMessage(user.id);
              return (
                <li
                  key={user.id}
                  className={`p-2 cursor-pointer ${
                    selectedUser?.id === user.id
                      ? 'bg-[#F5E2EF] text-white rounded-[10px] mb-2 sm:mb-4'
                      : 'hover:bg-[#F5E2EF] rounded-[10px] mb-2 sm:mb-4'
                  }`}
                  onClick={() => {
                    setSelectedUser(user);
                    setMessages([]);
                    setChatId(null);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={user.profileImage}
                        alt={`${user.name}'s profile`}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="text-[#000000] font-sans font-semibold text-sm sm:text-base">
                          {user.name}
                        </div>
                      </div>
                    </div>
                    {lastMessage && (
                      <div className="text-xs text-[#646A73]">
                        {lastMessage.dateTime}
                      </div>
                    )}
                  </div>
                  {lastMessage && (
                    <div className="text-xs ml-10 text-[#646A73]">
                      {lastMessage.text.length > 20
                        ? `${lastMessage.text.substring(0, 20)}...`
                        : lastMessage.text}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Chat Box Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto mb-2 sm:mb-4 p-2 sm:p-4">
            {selectedUser ? (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end my-2 ${
                      message.sender === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    {message.sender === 'user' && (
                      <img
                        src={selectedUser.profileImage}
                        alt={`${selectedUser.name}'s profile`}
                        className="w-8 h-8 rounded-full ml-2"
                      />
                    )}
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-500 text-right">
                        {message.dateTime}
                      </div>
                      {message.image ? (
                        <img
                          src={message.image}
                          alt="Uploaded content"
                          className="w-32 sm:w-48 md:w-64 h-auto rounded-lg"
                        />
                      ) : (
                        <div
                          className={`p-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-[#ee009d] text-white'
                              : 'bg-gray-300 text-black'
                          }`}
                        >
                          {message.text}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
          {selectedUser && (
            <div className="flex items-center p-2 sm:p-4 border-t-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 sm:p-4 border border-gray-300 focus:ring-0 focus:outline-none rounded-[20px]"
                placeholder="Type your message..."
              />
              <label className="ml-2 p-2 cursor-pointer">
                <UilPaperclip size={25} className="text-[#646A73]" />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <label className="p-2 cursor-pointer">
                <UilImage size={25} className="text-[#646a73]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 bg-[#ee009d] text-white text-xs sm:text-sm font-poppins rounded-lg flex items-center gap-1"
              >
                Send <UilMessage size={18} className="ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmployerChatBox;
