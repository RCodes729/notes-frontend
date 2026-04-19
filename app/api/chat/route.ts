import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  // Keep startup safe; actual request will return clear error below.
  // eslint-disable-next-line no-console
  console.warn('Missing OPENAI_API_KEY in environment');
}

const client = new OpenAI({ apiKey });

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server missing OPENAI_API_KEY' },
        { status: 500 },
      );
    }

    const body = await req.json();
    const messages = body?.messages as ChatMessage[] | undefined;

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages must be an array' },
        { status: 400 },
      );
    }

    const safeMessages = messages
      .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role,
        content: m.content.trim(),
      }))
      .slice(-20);

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant inside a Notes app. Keep answers clear, concise, and practical.',
        },
        ...safeMessages,
      ],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content ?? 'No response';
    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Chat API failed' },
      { status: 500 },
    );
  }
}