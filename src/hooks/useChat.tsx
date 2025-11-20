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

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!chatId) {
      setMessages([]);
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

  // Send message
  const sendMessage = async (payload: SendMessagePayload) => {
    if (!payload.message.trim()) return null;
    
    setLoading(true);
    try {
      const resp = await httpPostWithToken("chat/send-chat", payload);
      
      if (!resp?.error && resp?.data) {
        // Extract the new message from response
        let newMessage: Message | null = null;
        
        // Check if response has messages array
        if (resp.data.messages && Array.isArray(resp.data.messages)) {
          newMessage = resp.data.messages[resp.data.messages.length - 1];
        }
        // Or if response itself is the message
        else if (resp.data.id) {
          newMessage = resp.data;
        }
        
        // Add the new message immediately (optimistic update)
        if (newMessage !== null) {
          setMessages((prev): Message[] => {
            if (!newMessage) return prev; 
            const safeMessage: Message = newMessage;
        
            if (prev.some(m => m.id === safeMessage.id)) {
              return prev;
            }
        
            return [...prev, safeMessage];
          });
        }        
        
        setLoading(false);
        return resp.data;
      }
      
      setLoading(false);
      return null;
    } catch (err) {
      console.error('Error sending message:', err);
      setLoading(false);
      return null;
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    // Initial fetch
    fetchMessages();

    console.log(`🔌 Subscribing to private-chat.${chatId}`);

    try {
      channelRef.current = echo.private(`chat.${chatId}`);

      // Listen for new messages from WebSocket
      channelRef.current.listen('.message.sent', (data: any) => {
        console.log('New message received:', data);

        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some(m => m.id === data.id)) {
            return prev;
          }
          return [...prev, data];
        });
      });

      // Success callback
      channelRef.current.subscribed(() => {
        console.log('Successfully subscribed to chat.' + chatId);
      });

      // Error callback
      channelRef.current.error((error: any) => {
        console.error(' Channel subscription error:', error);
      });

    } catch (err) {
      console.error('Error subscribing to channel:', err);
    }

    // Cleanup
    return () => {
      if (channelRef.current) {
        console.log(`🔌 Unsubscribing from chat.${chatId}`);
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
