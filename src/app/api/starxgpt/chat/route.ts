import { NextRequest, NextResponse } from 'next/server';

// In-memory store for simplicity
const chatHistory: { type: string; message: any; }[] = [] as any;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // Store the user message
    chatHistory.push({ type: 'user', message: text });

    // Call the external API
    const apiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCcHZ5S38Cf5BmO3TI0XYHlyTe3SAz-hEI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }]
      }),
    });

    const data = await apiRes.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const parts = data.candidates[0].content.parts;
      const outputText = parts.map((part: any) => part.text).join(' ');

      // Store the bot response
      chatHistory.push({ type: 'bot', message: outputText });

      return NextResponse.json({ output: outputText });
    } else {
      console.error('Unexpected API response structure:', data);
      return NextResponse.json({ error: 'Unexpected response structure from the Gemini API' }, { status: 500 });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({ history: chatHistory });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
