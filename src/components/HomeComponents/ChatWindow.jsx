import React, { useEffect, useRef, useState } from 'react';
import API from '../../api/Api';

const ChatWindow = ({ chat }) => {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  const user = "saleem";

  // 🔌 WebSocket (FIXED VERSION)
  const [socketState, setSocketState] = useState('disconnected');

  useEffect(() => {
    if (!chat?.id) return;

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (!('WebSocket' in window)) {
      console.warn('WebSocket not supported in this browser.');
      setSocketState('unsupported');
      return;
    }

    let shouldReconnect = true;
    let reconnectTimer = null;

    const connect = () => {
      setSocketState('connecting');
      const wsUrl = `ws://${window.location.hostname}:8000/ws/chat/${chat.id}/`;
      let socket;

      try {
        socket = new WebSocket(wsUrl);
      } catch (err) {
        console.error('WebSocket constructor failed', err);
        setSocketState('failed');
        return;
      }

      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected ✅');
        setSocketState('connected');
      };

      socket.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (!data.message) return;

          setMessages((prev) => [
            ...prev,
            { text: data.message, sender: data.sender, isMe: data.sender === user },
          ]);
        } catch (err) {
          console.error('Failed to parse WebSocket message', err);
        }
      };

      socket.onerror = (err) => {
        console.error('WebSocket error ❌', err);
        setSocketState('error');
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed', event.code, event.reason);
        if (shouldReconnect) {
          setSocketState('reconnecting');
          reconnectTimer = setTimeout(connect, 2000);
        }
      };
    };

    connect();

    return () => {
      shouldReconnect = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [chat?.id, user]);

  // 📥 Fetch messages (FIXED)
  useEffect(() => {
    if (!chat?.id) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/api/messages/${chat.id}/`);

        const formatted = res.data.map(msg => ({
          text: msg.content,
          sender: msg.sender,
          isMe: msg.sender === user
        }));

        setMessages(formatted);

      } catch (err) {
        console.error("API error ❌", err);
      }
    };

    fetchMessages();

  }, [chat?.id]); // 🔥 FIXED dependency

  // 📤 Send message (SAFE VERSION)
  const sendMessage = async () => {
    if (!input.trim()) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: input, sender: user }));
      setInput('');
      return;
    }

    // Fallback to REST send endpoint if socket is unavailable
    try {
      await API.post(`/api/chat/${chat.id}/send/`, { message: input, sender: user });
      setMessages((prev) => [...prev, { text: input, sender: user, isMe: true }]);
      setInput('');
    } catch (err) {
      console.error('Message send failed', err);
      alert('Unable to send message right now. Try again.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white p-4">

      {/* MESSAGES */}
      <div className="mb-3 text-xs text-gray-500">
        WebSocket status: <strong>{socketState}</strong>. {socketState !== 'connected' && 'Using fallback mode.'}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">

        {messages.map((m, i) => (
          <div key={i} className={m.isMe ? "text-right" : "text-left"}>
            <span className={`px-3 py-1 rounded inline-block
              ${m.isMe ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
              
              <b>{m.sender}:</b> {m.text}
            </span>
          </div>
        ))}

      </div>

      {/* INPUT */}
      <div className="flex gap-2 mt-2">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button 
          onClick={sendMessage} 
          className="bg-blue-500 text-white px-3 rounded"
        >
          Send
        </button>

      </div>

    </div>
  );
};

export default ChatWindow;