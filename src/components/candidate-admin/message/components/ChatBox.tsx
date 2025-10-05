import { UilImage, UilMessage, UilPaperclip } from '@iconscout/react-unicons';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Images from '../../../constant/Images';
import { httpGetWithToken, httpPostWithToken } from '../../../../utils/http_utils';
import { AppContext } from '../../../../global/state';
import ls from "localstorage-slim";
import moment from 'moment/moment';

interface ChatUser {
  id: number;
  name: string;
  profileImage: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const user:any = ls.get("wwph_usr", {decrypt : true})

  const [chatUsers, setChatUsers] = useState<any[]>([
  ]);
  const [selectedChat, setselectedChat] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false)
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    if(loading) return;
    setLoading(true)
    const message = {
      "user_id" : user.id === selectedChat.user1.id ?  selectedChat.user2.id :  selectedChat.user1.id,
      "message" : newMessage,
      "chat_id" : selectedChat.id
    }
    await httpPostWithToken("chat/send-chat", message)
    setLoading(false)
    setNewMessage('');
    getChatSingle(selectedChat.id)
    getChat()
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const message: any = {
        id: messages.length + 1,
        text: `File uploaded: ${files[0].name}`,
        sender: 'user',
        dateTime: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }),
      };

      setMessages([...messages, message]);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      const message: any = {
        id: messages.length + 1,
        text: '',
        sender: 'user',
        dateTime: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }),
        image: imageUrl,
      };

      setMessages([...messages, message]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    getChat();
  }, [messages]);
  const getChat = async () => {
    const resp = await httpGetWithToken("chat")
    if (resp.status == "success") {
      setChatUsers(resp.data)
    }
  }

  const getChatSingle = async (id:string) => {
    const resp = await httpGetWithToken("chat/"+id)
    if (resp.status == "success") {
      setMessages(resp.data.messages)
    }
  }
  useEffect(() => {
    if(selectedChat) getChatSingle(selectedChat?.id);
  }, [selectedChat]);

  return (
    <section className='px-2 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] mx-auto'>
      <h2 className='text-[#2aa100] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-4 sm:mb-6 md:mb-8'>Message</h2>
      <div className="flex flex-col min-h-[350px] md:flex-row w-full bg-white rounded-lg shadow-lg">
        {/* Chat List Section */}
        <div className="w-full md:w-1/4 border-r-0 md:border-r-2 p-2 sm:p-4">
          <h2 className="text-lg font-bold mb-2 sm:mb-4">Chats</h2>
          <ul>
            {chatUsers.map((chat:any) => {
              const lastMessage:any = chat.last_message;
              return (
                <li
                  key={user.id}
                  className={`p-2 cursor-pointer ${selectedChat?.id === chat.id ? 'bg-[#F5E2EF] text-white rounded-[10px] mb-2 sm:mb-4' : 'hover:bg-[#F5E2EF] rounded-[10px] mb-2 sm:mb-4'}`}
                  onClick={() => setselectedChat(chat)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={ user.id == chat.user1.id ? chat.user2.avatar : chat.user1.avatar}
                        alt={`${user.id == chat.user1.id ? chat.user2.name : chat.user1.name}'s profile`}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className='text-[#000000] font-sans font-semibold text-sm sm:text-base'>{user.id == chat.user1.id ? chat.user2.name : chat.user1.name}</div>
                      </div>
                    </div>
                    {lastMessage && (
                      <div className="text-xs text-[#646A73]">
                        {moment(lastMessage.created_at).format("Do, MMM").toString()}
                      </div>
                    )}
                  </div>
                  {lastMessage && (
                    <div className="text-xs ml-10 text-[#646A73]">
                      {lastMessage.message.length > 20 ? `${lastMessage.message.substring(0, 20)}...` : lastMessage.message}
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
            {selectedChat ? (
              <>
                {messages.map((message:any) =>{
                  let user2 = user.id == selectedChat.user1.id ? selectedChat.user2 : selectedChat.user1
                  return (
                  <div
                    key={message.id}
                    className={`flex items-end my-2 ${message.user_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.user_id === user.id ? (
                      <img
                        src={user.avatar}
                        alt={`${user.name}'s profile`}
                        className="w-8 h-8 rounded-full ml-2"
                      />
                    ):
                    <img
                    src={user2.avatar}
                    alt={`${user2.name}'s profile`}
                    className="w-8 h-8 rounded-full ml-2"
                  />
                    }
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-500 text-right">
                        {moment(message.created_at).format("Do, MMM | h:mm a").toString()}
                      </div>

                      {message.image ? (
                        <img src={message.image} alt="Uploaded content" className="w-32 sm:w-48 md:w-64 h-auto rounded-lg" />
                      ) : (
                        <div className={`p-2 rounded-lg ${message.user_id === user.id ? 'bg-[#ee009d] text-white' : 'bg-gray-300 text-black'}`}>
                          {message.message}
                        </div>
                      )}
                    </div>
                  </div>
                )})}
                <div ref={messagesEndRef}></div>
              </>
            ) : (
              <div className="text-center text-gray-500">Select a chat to start messaging</div>
            )}
          </div>
          {selectedChat && (
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
                {loading ? "...." : "Send"}<UilMessage size={18} className="ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatBox;
