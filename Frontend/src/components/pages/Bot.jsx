import { useState, useRef, useEffect } from "react";

export default function Bot({ title = "Ask your Doubts away...." }) {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "👋 Hey there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Call backend
  const sendToBackend = async (message) => {
    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      return data.reply; // backend sends { reply: "..." }
    } catch (err) {
      console.error("Error:", err);
      return "⚠️ Error connecting to server.";
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { id: Date.now(), from: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const reply = await sendToBackend(trimmed);
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "bot", text: reply },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <div className="flex flex-col w-full max-w-3xl h-[80vh] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-xs text-green-300 animate-pulse">● Online</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-md transition-all duration-200 ${
                  m.from === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-700 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-bl-none text-sm animate-pulse shadow">
                Bot is typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form
            className="flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 resize-none rounded-xl p-3 bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              rows={1}
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 text-white font-semibold hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
