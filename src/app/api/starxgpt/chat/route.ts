import { connectToDatabase } from "@/lib/mongodb";
import ChatModel from "@/models/Chats";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // Use uuid to generate new session IDs

//fetch the data from the Gemini API
async function fetchFromGemini(
  text: string,
  history: string[]
): Promise<string> {
  const context = history.map((entry: any) => entry.message).join("\n");
  const apiRes = await fetch(process.env.GEMINI_API_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: context + "\n" + text }] }],
    }),
  });
  const data = await apiRes.json();
  if (
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts
  ) {
    const parts = data.candidates[0].content.parts;
    const outputText = parts.map((part: any) => part.text).join(" ");
    return outputText;
  } else {
    throw new Error("Unexpected response structure from the Gemini API");
  }
}

// POST request handler
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connectToDatabase();

    const { text, sessionId, history } = await req.json();
    const outputText = await fetchFromGemini(text, history);
    const timestamp = new Date().toISOString();

    // Ensure sessionId is always defined (generate a new one if needed)
    let currentSessionId = sessionId || uuidv4();
    // Check if session exists
    let session = await ChatModel.findOne({ sessionId: currentSessionId });
    // If session exists, update it with the new message
    if (session) {
      session.content.push({
        role: "user",
        message: text,
        time: timestamp,
      });
      session.content.push({
        role: "bot",
        message: outputText,
        time: timestamp,
      });

      await session.save();
    } else {
      // If session does not exist, create a new one
      session = new ChatModel({
        sessionId: currentSessionId,
        content: [
          {
            role: "user",
            message: text,
            time: timestamp,
          },
          {
            role: "bot",
            message: outputText,
            time: timestamp,
          },
        ],
      });
      await session.save();
    }

    return NextResponse.json({
      success: true,
      output: outputText,
      sessionId: currentSessionId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET request handler
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectToDatabase(); // Connect to the database
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    let session;
    if (sessionId) {
      // Check if a session with this sessionId exists
      session = await ChatModel.findOne({ sessionId });
    }
    if (session) {
      // If session exists, return the session's messages
      return NextResponse.json({
        sessionId: session.sessionId,
        messages: session.content,
      });
    } else {
      // If no session is found, return a message or handle it as needed
      return NextResponse.json({
        message: "No existing session found",
        sessionId: null,
        messages: [],
      });
    }
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
