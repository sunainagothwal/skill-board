import React, { useEffect, useRef, useState } from "react";

function ChatPage() {
  const [myUserId, setMyUserId] = useState(null);
  const [threads, setThreads] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* =========================
     AUTO SCROLL
  ========================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     FETCH LOGGED-IN USER
  ========================== */
  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/me`,
        { credentials: "include" }
      );
      const data = await res.json();
      setMyUserId(data?.user?._id || null);
    };
    fetchMe();
  }, []);

  /* =========================
     FETCH CHAT THREADS
  ========================== */
  useEffect(() => {
    if (!myUserId) return;

    fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/chat/threads`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setThreads(d.threads || []));
  }, [myUserId]);

  /* =========================
     WEBSOCKET
  ========================== */
  useEffect(() => {
    if (!myUserId) return;

    socketRef.current = new WebSocket(
      `${import.meta.env.VITE_APP_WS_URL}/ws?userId=${myUserId}`
    );

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type !== "NEW_MESSAGE") return;

      const msg = data.message;
      const senderId = msg.sender?._id || msg.sender;
      const taskId = msg.task?._id || msg.task;

      // Update messages if active chat
      if (
        activeChat &&
        activeChat.partnerId === senderId &&
        activeChat.taskId === taskId
      ) {
        setMessages((prev) =>
          prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
        );

        // Mark read immediately
        fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/chat/read/${senderId}`,
          { method: "PUT", credentials: "include" }
        );
      }

      // Update sidebar threads
      setThreads((prev) =>
        prev.map((t) =>
          t._id.task === taskId
            ? {
                ...t,
                latestMessage: msg,
                unreadCount:
                  activeChat &&
                  activeChat.partnerId === senderId &&
                  activeChat.taskId === taskId
                    ? 0
                    : t.unreadCount + (senderId !== myUserId ? 1 : 0),
              }
            : t
        )
      );
    };

    return () => socketRef.current?.close();
  }, [myUserId, activeChat]);

  /* =========================
     OPEN CHAT
  ========================== */
  const openChat = async (partnerId, taskId) => {
    setActiveChat({ partnerId, taskId });
    setMessages([]);

    // Clear unread locally
    setThreads((prev) =>
      prev.map((t) =>
        t._id.task === taskId ? { ...t, unreadCount: 0 } : t
      )
    );

    // Mark read in backend
    fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/chat/read/${partnerId}`,
      { method: "PUT", credentials: "include" }
    );

    const res = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/chat/${partnerId}/${taskId}`,
      { credentials: "include" }
    );
    const data = await res.json();
    setMessages(data.messages || []);
  };

  /* =========================
     SEND MESSAGE
  ========================== */
  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;

    const tempMessage = {
      _id: `tmp-${Date.now()}`,
      sender: { _id: myUserId },
      message: input,
    };

    // Optimistic UI
    setMessages((prev) => [...prev, tempMessage]);
    setInput("");

    const res = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/chat/${activeChat.partnerId}/${activeChat.taskId}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: tempMessage.message }),
      }
    );

    const data = await res.json();
    if (data?.message) {
      setMessages((prev) =>
        prev.map((m) => (m._id === tempMessage._id ? data.message : m))
      );
    }
  };

  if (!myUserId) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h3 style={{ padding: 12 }}>Chats</h3>

        {threads.map((t) => {
          const latest = t.latestMessage;
          if (!latest?.sender || !latest?.receiver) return null;

          const taskId = t._id.task;
          const partner =
            latest.sender._id === myUserId
              ? latest.receiver
              : latest.sender;

          return (
            <div
              key={taskId + partner._id}
              onClick={() => openChat(partner._id, taskId)}
              style={{
                padding: 12,
                cursor: "pointer",
                background:
                  activeChat?.partnerId === partner._id
                    ? "#f5f7fb"
                    : "white",
                borderBottom: "1px solid #eee",
              }}
            >
              <strong>{partner.name}</strong>
              <p style={{ margin: "4px 0", color: "#555" }}>
                {latest.message}
              </p>
              {t.unreadCount > 0 && (
                <span
                  style={{
                    background: "#ff4d4f",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                >
                  {t.unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* CHAT WINDOW */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeChat ? (
          <>
            <div
              style={{
                flex: 1,
                padding: 16,
                overflowY: "auto",
                background: "#fafafa",
              }}
            >
              {messages.map((m) => {
                const isMine = m.sender?._id === myUserId;
                return (
                  <div
                    key={m._id}
                    style={{
                      textAlign: isMine ? "right" : "left",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "10px 14px",
                        background: isMine ? "#d9fdd3" : "#fff",
                        borderRadius: 18,
                        maxWidth: "70%",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {m.message}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div
              style={{
                display: "flex",
                padding: 12,
                borderTop: "1px solid #ddd",
                background: "#fff",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 20,
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  marginLeft: 10,
                  padding: "0 20px",
                  borderRadius: 20,
                  background: "#1677ff",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p style={{ padding: 20 }}>Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
