import React, { useState, useEffect, useRef } from 'react';
import './index.css';import './App.css';
export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [analytics, setAnalytics] = useState({
    totalMessages: 1,
    userMessages: 0,
    botMessages: 1,
    emojiUsed: 0,
    totalWords: 7
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    const wordCount = input.trim().split(/\s+/).length;
    const emojiCount = [...input.matchAll(/\p{Emoji}/gu)].length;

    setMessages(prev => [...prev, userMsg]);
    setAnalytics(prev => ({
      totalMessages: prev.totalMessages + 1,
      userMessages: prev.userMessages + 1,
      botMessages: prev.botMessages,
      totalWords: prev.totalWords + wordCount,
      emojiUsed: prev.emojiUsed + emojiCount
    }));
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const botText = `You said: "${userMsg.text}". I'm just a dummy bot for now.`;
      const botReply = { role: 'bot', text: botText };

      setMessages(prev => [...prev, botReply]);
      setAnalytics(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        botMessages: prev.botMessages + 1,
        totalWords: prev.totalWords + botText.trim().split(/\s+/).length
      }));

      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col relative">
      {/* ✅ Top control bar */}
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsDark(prev => !prev)}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white text-sm px-3 py-1 rounded shadow"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button
            onClick={() => {
              const data = JSON.stringify(messages, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'chat-history.json';
              a.click();
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded shadow"
          >
            Export Chat
          </button>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded shadow"
        >
          Logout
        </button>
      </div>

      {/* ✅ Analytics Dashboard */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow mx-4 mt-4 text-sm">
        <h2 className="font-semibold text-lg mb-2">📊 Chat Analytics</h2>
        <ul className="space-y-1">
          <li>Total Messages: {analytics.totalMessages}</li>
          <li>User Messages: {analytics.userMessages}</li>
          <li>Bot Messages: {analytics.botMessages}</li>
          <li>Total Emojis Used: {analytics.emojiUsed}</li>
          <li>Average Words/Message: {(analytics.totalWords / analytics.totalMessages).toFixed(1)}</li>
          <li>👉Use window + "." for emojis</li>
        </ul>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded-lg max-w-lg ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white self-start mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="italic text-gray-500 dark:text-gray-400 mb-2">
            Bot is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex">
        <input
          className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
