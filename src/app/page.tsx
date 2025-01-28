'use client';
import { useChatHistory } from '@/lib/useChatHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  content: string;
  role: 'user' | 'assistant' | 'error';
}

export default function ChatPage() {
  const { messages, saveMessages, clearHistory } = useChatHistory();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null); // Add proper type to ref

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const newMessages: Message[] = [...messages, { content: input, role: 'user' }];
    saveMessages(newMessages);

    try {
      const response = await axios.post('/api/chat', {
        messages: newMessages
      });

      const updatedMessages: Message[] = [
        ...newMessages,
        { content: response.data.response, role: 'assistant' }
      ];
      
      saveMessages(updatedMessages);
    } catch (error) {
      console.error('Error:', error);
      const errorMessages: Message[] = [
        ...newMessages,
        { content: 'Error fetching response', role: 'error' }
      ];
      saveMessages(errorMessages);
    }

    setInput('');
    setIsLoading(false);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className = "dark">
    <div className="flex flex-col h-screen p-4">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">DeepSeek Chat</h1>
          <Button 
            variant="destructive" 
            onClick={clearHistory}
            disabled={isLoading}
          >
            Clear History
          </Button>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea 
            className="flex-1 p-4" 
            ref={scrollRef} // Changed from viewportRef to ref
          >
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground'
                        : msg.role === 'error'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
    </div>
  );
}