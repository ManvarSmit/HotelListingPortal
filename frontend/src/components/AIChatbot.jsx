import React, { useState, useRef, useEffect } from "react";

export default function AIChatbot({ currUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "👋 Hi! I'm your Wanderlust AI assistant. Ask me to find hotels, plan trips, or anything travel-related!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // History = all messages except the initial greeting
      const history = newMessages.slice(1).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: userMessage.text,
          history: history.slice(0, -1), // exclude current message
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "⚠️ " + data.error },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "Sorry, I couldn't get a response. Please try again!" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "🏖️ Beach hotels under ₹5000",
    "🏔️ Mountain retreats",
    "⭐ Most popular listings",
    "🌆 City hotels",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <button
        id="ai-chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #e53935, #ff7043)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(229, 57, 53, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          fontSize: "24px",
          color: "white",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(229, 57, 53, 0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(229, 57, 53, 0.5)";
        }}
        title="AI Travel Assistant"
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          id="ai-chatbot-window"
          style={{
            position: "fixed",
            bottom: "100px",
            right: "28px",
            width: "370px",
            height: "520px",
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9998,
            overflow: "hidden",
            animation: "slideUpFadeIn 0.3s ease",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #e53935, #ff7043)",
              padding: "16px 20px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "15px" }}>Wanderlust AI</div>
              <div style={{ fontSize: "12px", opacity: 0.85, display: "flex", alignItems: "center", gap: "5px" }}>
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#69f0ae",
                    display: "inline-block",
                  }}
                ></span>
                Travel Assistant · Online
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "#f8f9fa",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #e53935, #ff7043)"
                        : "#ffffff",
                    color: msg.role === "user" ? "#fff" : "#333",
                    fontSize: "13.5px",
                    lineHeight: "1.5",
                    boxShadow:
                      msg.role === "user"
                        ? "0 2px 8px rgba(229,57,53,0.3)"
                        : "0 2px 8px rgba(0,0,0,0.08)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 16px",
                    background: "#fff",
                    borderRadius: "18px 18px 18px 4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#e53935",
                        display: "inline-block",
                        animation: `bounce 1s infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (show only initially) */}
          {messages.length === 1 && !loading && (
            <div
              style={{
                padding: "8px 14px",
                background: "#f8f9fa",
                borderTop: "1px solid #eee",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q.replace(/^[^\s]+\s/, ""));
                  }}
                  style={{
                    background: "#fff",
                    border: "1px solid #e53935",
                    color: "#e53935",
                    borderRadius: "20px",
                    padding: "4px 10px",
                    fontSize: "11.5px",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e53935";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#e53935";
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={sendMessage}
            style={{
              padding: "12px 14px",
              background: "#fff",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <input
              id="ai-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about hotels, destinations..."
              disabled={loading}
              style={{
                flex: 1,
                border: "1.5px solid #eee",
                borderRadius: "24px",
                padding: "9px 16px",
                fontSize: "13px",
                outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#e53935")}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background:
                  loading || !input.trim()
                    ? "#ddd"
                    : "linear-gradient(135deg, #e53935, #ff7043)",
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideUpFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
