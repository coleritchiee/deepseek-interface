export interface Message {
    content: string;
    role: 'user' | 'assistant' | 'error';
    context?: any;
  }