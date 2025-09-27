import Bot from './component/Bot'

function BotP() {
  const handleSend = async (message) => {
    try {
        const res = await fetch("http://localhost:8080/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
          });
          

      const data = await res.json();
      return data.reply; // Bot.jsx will display this
    } catch (err) {
      console.error("Error:", err);
      return "⚠️ Error connecting to server.";
    }
  };

  return <Bot title="Chat with Mistral 🤖" onSend={handleSend} />;
}

export default BotP;