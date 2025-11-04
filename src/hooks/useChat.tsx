import { useEffect, useState, useCallback } from "react";
import { httpGetWithToken, httpPostWithToken } from './../utils/http_utils';
import { echo } from './../utils/echo';

interface SendMessagePayload {
  message: string;
  receiver_id: number;
  chat_id?: number;
}

export function useChat(chatId: number | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    const resp = await httpGetWithToken(`chat/${chatId}`);
    if (!resp?.error && resp?.data) {
      setMessages(resp.data.messages || []);
    }
    setLoading(false);
  }, [chatId]);

  const sendMessage = async (payload: SendMessagePayload) => {
    if (!payload.message.trim()) return null;
    const resp = await httpPostWithToken("chat/send-chat", payload);
    if (!resp?.error && resp?.data) {
      if (Array.isArray(resp.data.messages)) {
        setMessages(resp.data.messages);
      } else {
        setMessages((prev) => [...prev, resp.data]);
      }
      return resp.data;
    }
    return null;
  };

  useEffect(() => {
    if (!chatId) return;
    fetchMessages();

    const channel = echo.private(`chat.${chatId}`);
    channel.listen(".message.sent", (e: any) => {
      if (e?.message) {
        setMessages((prev) => [...prev, e.message]);
      }
    });

    return () => {
      echo.leave(`chat.${chatId}`);
    };
  }, [chatId, fetchMessages]);

  return { messages, sendMessage, loading };
}
