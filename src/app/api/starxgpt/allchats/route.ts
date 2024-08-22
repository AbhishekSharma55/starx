import { connectToDatabase } from "@/lib/mongodb";
import ChatModel from "@/models/Chats";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectToDatabase(); // Connect to the database
    let allChats = [];
    allChats = await ChatModel.find({});
    allChats = allChats.reverse();
    return NextResponse.json({
      allChats: allChats,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
