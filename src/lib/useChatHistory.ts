import { useState, useEffect, SetStateAction } from 'react';

interface Message {
  content: string;
  role: 'user' | 'assistant' | 'error';
}

export function useChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }
  }, []);

  // Save to localStorage whenever messages change
  const saveMessages = (newMessages: SetStateAction<Message[]>) => {
    setMessages(newMessages);
    localStorage.setItem('chatHistory', JSON.stringify(newMessages));
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  return { messages, saveMessages, clearHistory };
}