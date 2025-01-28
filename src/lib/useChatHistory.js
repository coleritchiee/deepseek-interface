import { useState, useEffect } from 'react';

export function useChatHistory() {
  const [messages, setMessages] = useState([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }
  }, []);

  // Save to localStorage whenever messages change
  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('chatHistory', JSON.stringify(newMessages));
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  return { messages, saveMessages, clearHistory };
}