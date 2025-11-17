import { useEffect, useState, useCallback, useRef } from "react";
import { httpGetWithToken, httpPostWithToken } from './../utils/http_utils';
import { echo } from './../utils/echo';


interface Message {
  id: number;
  message: string;
  user_id: number;
  chat_id: number;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}

interface SendMessagePayload {
  message: string;
  receiver_id: number;
  chat_id?: number;
}

export function useChat(chatId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<any>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId) {
      setMessages([])
      return;
    }

    try {
      const resp = await httpGetWithToken(`chat/${chatId}`);
      if (!resp?.error && resp?.data?.messages) {
        setMessages(resp.data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [chatId]);

  const sendMessage = async (payload: SendMessagePayload) => {
    if (!payload.message.trim()) return null;
    
    setLoading(true);
    try {
      const resp = await httpPostWithToken("chat/send-chat", payload);
      setLoading(false);

      if (!resp?.error) {
        return resp.data;
      }
      return null;
    } catch (err) {
      console.error('Error sending message:', err);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    fetchMessages();

    console.log(`Subscribing to private-chat.${chatId}`);

    try {
      channelRef.current = echo.private(`chat.${chatId}`);

      channelRef.current.listen('.message.sent', (data: any) => {
        console.log('New message received:', data);

        setMessages((prev) => {
          if (prev.some(m => m.id === data.id)) {
            return prev;
          }

          return [...prev, data];
        });
      });


    channelRef.current.subscribed(() => {
      console.log('Successfully subscribed to chat.' + chatId);
    });

    channelRef.current.error((error: any) => {
      console.error('channel subscription error:', error);
    });

  } catch (err) {
    console.error('Error subscribing to channel:', err);
  }

  return () => {
    if (channelRef.current) {
      console.log(`Unsubscribing from chat.${chatId}`);
      echo.leave(`chat.${chatId}`);
      channelRef.current = null;
    }
  };
}, [chatId, fetchMessages]);

return {
  messages,
  sendMessage,
  loading,
  refetch: fetchMessages
};

}
