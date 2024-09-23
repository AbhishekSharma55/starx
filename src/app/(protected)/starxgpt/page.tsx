"use client";
import { useEffect, useRef, useState, FormEvent, Key } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { TextGenerateEffect } from "@/components/text-generate-effect";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./style.css";
import ChatModel from "@/models/Chats";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

export default function StarXGPTPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [allChatsLoading, setAllChatsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [allChats, setAllChats] = useState<(typeof ChatModel)[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollFunction = () => {
    setTimeout(() => {
      chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollFunction();
  }, [chatHistory]);

  const openPreviousChat = async (sessionId: string) => {
    const res = await fetch(`/api/starxgpt/chat?sessionId=${sessionId}`, {
      method: "GET",
    });
    const data = await res.json();
    setChatHistory(data.messages || []);
    setCurrentSessionId(sessionId);
    scrollFunction();
  };

  const newChat = async () => {
    setCurrentSessionId(null);
    setChatHistory([]);
  };

  useEffect(() => {
    setAllChatsLoading(true);
    const fetchAllChats = async () => {
      const res = await fetch(`/api/starxgpt/allchats`, {
        method: "GET",
      });
      const data = await res.json();
      setAllChats(data.allChats || []);
      setAllChatsLoading(false);
    };
    fetchAllChats();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        SubmitPrompt(event as any);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [input]);

  useEffect(() => {
    const fetchChatData = async () => {
      const res = await fetch(
        `/api/starxgpt/chat?sessionId=${currentSessionId}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      setChatHistory(data.messages || []);
    };
    fetchChatData();
  }, [currentSessionId]);

  const SubmitPrompt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const res = await fetch("/api/starxgpt/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: input,
        sessionId: currentSessionId,
        history: chatHistory,
      }),
    });
    const data = await res.json();
    if (data.sessionId) {
      setCurrentSessionId(data.sessionId);
    }
    setResponse(data.output);

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { role: "user", message: input },
      { role: "bot", message: data.output },
    ]);
    setInput("");
    setLoading(false);

    setTimeout(() => {
      chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex space-x-4 h-screen overflow-hidden pt-10">
      {/* Sidebar for Previous Chats */}
      <div className="w-1/4 h-full overflow-y-auto p-4 bg-gray-50">
        <h2 className="text-xs font-semibold text-gray-500 mb-4">
          Previous Chats
        </h2>
        <button
          onClick={() => newChat()}
          className="flex items-center gap-4 w-3/4 text-left py-2 px-4 rounded-lg hover:bg-gray-200 mb-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={"/placeholder-user.jpg"} alt={"Gemini"} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="text-sm font-bold truncate">New Chat</div>
        </button>
        {allChatsLoading ? (
          <Skeleton className="w-[100px] h-[20px] rounded-full" />
        ) : (
          allChats.map((chat: any, index: Key | null | undefined) => (
            <button
              key={index}
              onClick={() => openPreviousChat(chat.sessionId)}
              className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-200 mb-2"
            >
              <div className="text-sm font-bold truncate">
                {chat.content[0]?.message.length <= 20
                  ? chat.content[0]?.message
                  : chat.content[0]?.message.slice(0, 20) + "....."}
              </div>
              <div className="text-xs text-gray-400">
                {moment().to(chat.createdAt)}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto overflow-hidden p-6 bg-gray-50">
          {chatHistory.length > 0 ? (
            <div className="space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role !== "user" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-lg p-4 rounded-xl shadow-md break-words ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            msg.role === "user"
                              ? "/placeholder-user.jpg"
                              : "/placeholder-user.jpg"
                          }
                          alt={msg.role === "user" ? "User" : "starx gpt"}
                        />
                        <AvatarFallback>
                          {msg.role === "user" ? "U" : "G"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">
                        {msg.role === "user" ? "You" : "starx gpt"}
                      </span>
                    </div>
                    <div className="prose prose-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <Skeleton className="w-2/3 h-20 rounded-lg" />
                </div>
              )}
              <div ref={chatContainerRef} />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-xl text-gray-500">
              <TextGenerateEffect words="Welcome to STARX GPT" />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={SubmitPrompt}
          className="p-4 bg-white border-t border-gray-300"
        >
          <div className="relative flex items-center">
            <Textarea
              placeholder="Message Gemini..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-transparent border absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 hover:bg-slate-300"
            >
              <ArrowUpIcon className="w-6 h-6" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ArrowUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}
