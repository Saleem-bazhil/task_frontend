import React, { useState, useEffect, useRef } from "react";

const ChatWindow = ({ room, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const ws = useRef(null);
  const bottomRef = useRef(null);

  const BASE = "http://127.0.0.1:8000";

  // ðŸ“¥ Fetch history
  useEffect(() => {
    if (!room) return;

    fetch(`${BASE}/api/messages/${room}/`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(m => ({
          id: m.id,
          text: m.content,
          sender: m.sender,
          isMe: m.sender === currentUser
        }));
        setMessages(formatted);
      });
  }, [room, currentUser]);

  // ðŸ”Œ WebSocket
  useEffect(() => {
    if (!room) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${room}/`);
    ws.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: data.message,
          sender: data.sender,
          isMe: data.sender === currentUser
        }
      ]);
    };

    return () => socket.close();
  }, [room, currentUser]);

  // ðŸ”½ scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ðŸ“¤ send
  const sendMessage = () => {
    if (!message.trim()) return;

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        message,
        sender: currentUser
      }));
    }

    setMessage("");
  };

  if (!room) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border">

      {/* HEADER */}
      <div className="p-4 border-b font-bold">
        {room}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map(m => (
          <div key={m.id} className={m.isMe ? "text-right" : "text-left"}>
            <div className={`inline-block px-3 py-2 rounded m-1
              ${m.isMe ? "bg-pink-500 text-white" : "bg-white border"}`}>
              <b>{m.sender}</b><br/>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 flex gap-2 border-t">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-pink-500 text-white px-4 rounded">
          Send
        </button>
      </div>

    </div>
  );
};

export default ChatWindow;

