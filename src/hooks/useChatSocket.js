import { useEffect, useEffectEvent, useRef, useState } from "react";

import { WS_URL } from "../config/env";

const MAX_RETRIES = 5;

export function useChatSocket({ roomId, token, onMessage }) {
  const socketRef = useRef(null);
  const retryCountRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const intentionalCloseRef = useRef(false);
  const handleMessage = useEffectEvent(onMessage);
  const [status, setStatus] = useState("idle");
  const isActive = Boolean(roomId && token);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    intentionalCloseRef.current = false;

    const connect = () => {
      setStatus("connecting");
      const socket = new WebSocket(`${WS_URL}/ws/chat/${roomId}/?token=${encodeURIComponent(token)}`);
      socketRef.current = socket;

      socket.onopen = () => {
        retryCountRef.current = 0;
        setStatus("connected");
      };

      socket.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        if (payload.type === "error") {
          setStatus("error");
          return;
        }
        handleMessage(payload);
      };

      socket.onerror = () => {
        setStatus("error");
      };

      socket.onclose = () => {
        socketRef.current = null;
        if (intentionalCloseRef.current) {
          setStatus("idle");
          return;
        }

        if (retryCountRef.current >= MAX_RETRIES) {
          setStatus("failed");
          return;
        }

        retryCountRef.current += 1;
        setStatus("reconnecting");
        reconnectTimerRef.current = window.setTimeout(connect, 1000 * retryCountRef.current);
      };
    };

    connect();

    return () => {
      intentionalCloseRef.current = true;
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isActive, roomId, token]);

  const sendMessage = (message) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      return false;
    }

    socketRef.current.send(JSON.stringify({ message }));
    return true;
  };

  return { status: isActive ? status : "idle", sendMessage };
}
