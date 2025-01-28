import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // Format messages for Ollama
    const formattedPrompt = messages
      .map(msg => `${msg.role === 'user' ? '[INST] ' : ''}${msg.content}${msg.role === 'user' ? ' [/INST]' : ''}`)
      .join('\n');

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Use the chat model variant
        prompt: formattedPrompt,
        stream: false,
        context: messages.length > 0 ? messages[messages.length - 1].context : null,
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama API request failed');
    }

    const data = await response.json();
    return NextResponse.json({ 
      response: data.response,
      context: data.context 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}