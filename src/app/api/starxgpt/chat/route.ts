import { connectToDatabase } from "@/lib/mongodb";
import ChatModel from "@/models/Chats";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'; // Use uuid to generate new session IDs


async function fetchFromGemini(text: string): Promise<string> {
  const apiRes = await fetch(process.env.GEMINI_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
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

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connectToDatabase(); // Connect to the database

    const { text, sessionId } = await req.json();
    const outputText = await fetchFromGemini(text);
    const timestamp = new Date().toISOString();

    // Use provided sessionId or generate a new one
    const currentSessionId = sessionId || uuidv4();
    console.log("Session ID being used: ", currentSessionId);

    // Check if session exists
    let session = await ChatModel.findOne({ sessionId: currentSessionId });

    if (session) {
      console.log("Session Found");
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
      console.log("Creating new session");
      console.log("Session ID for new entry: ", currentSessionId);
      
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

    return NextResponse.json({ success: true, output: outputText, sessionId: currentSessionId });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectToDatabase(); // Connect to the database
    console.log("GET request");
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    let session;
    let allChats = [];
    allChats = await ChatModel.find({});
    if (sessionId) {
      // Check if a session with this sessionId exists
      session = await ChatModel.findOne({ sessionId });
    }
    console.log("Session ID: ", sessionId);
    if (session) {
      // If session exists, return the session's messages
      console.log("Session found");
      return NextResponse.json({ 
        sessionId: session.sessionId,
      });
    } else {
      // If no session is found, return a message or handle it as needed
      return NextResponse.json({ 
        message: "No existing session found", 
        sessionId: null, 
        messages: [] ,
        allChats: allChats
      });
    }
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}