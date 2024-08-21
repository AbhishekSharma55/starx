"use client";
import { FormEvent, Key, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { TextGenerateEffect } from "@/components/text-generate-effect";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

// Define the structure of a chat message
interface ChatMessage {
  type: "user" | "bot";
  message: string;
}

export default function StarXGPTPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

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
    // Fetch chat history on component mount
    const fetchHistory = async () => {
      const res = await fetch("/api/starxgpt/chat");
      const data = await res.json();
      setChatHistory(data.history || []);
    };

    fetchHistory();
  }, []);

  const SubmitPrompt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Create new chat history with the user input
    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { type: "user", message: input },
    ];
    setChatHistory(newHistory);

    const res = await fetch("/api/starxgpt/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: input }),
    });

    const data = await res.json();
    setResponse(data.output);

    // Add bot response to chat history
    setChatHistory([...newHistory, { type: "bot", message: data.output }]);

    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex space-x-4">
      <div className="w-1/4 h-screen overflow-auto scrollbar-hidden">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="mt-4 grid gap-1 p-2 text-foreground">
            <div className="px-2 text-xs font-medium text-muted-foreground">
              Today
            </div>
            {[...Array(120)].map((_, index) => (
              <Link
                href="#"
                key={index}
                className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50"
              >
                {`Link ${index + 1}`}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-screen overflow-auto scrollbar-hidden">
        <header className="fixed top-10 w-full flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <BotIcon className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-medium">
              <TextGenerateEffect className="mb-4" words={"STAR X ASSISTANT"} />
            </h1>
          </div>
        </header>
        {chatHistory.length > 0 ? (
          <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 mb-20 mt-20">
            <div className="w-full px-20 space-y-8">
              <div className="flex flex-col space-y-4">
                {chatHistory.map((msg: { type: string; message: string | null | undefined; }, index: Key | null | undefined) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 ${
                      msg.type === "user" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <Avatar className="h-8 w-8 shrink-0 border">
                      <AvatarImage
                        src={
                          msg.type === "user"
                            ? "/placeholder-user.jpg"
                            : "/placeholder-bot.jpg"
                        }
                        alt="Image"
                      />
                      <AvatarFallback>
                        {msg.type === "user" ? "U" : "B"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="font-bold">
                        {msg.type === "user" ? "You" : "STARX GPT"}
                      </div>
                      <div className="prose text-muted-foreground">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className="space-y-4 text-black">
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <div className="flex flex-row min-h-screen justify-center items-center text-xl">
            <TextGenerateEffect words="Welcome to STARX GPT" />
          </div>
        )}
        <form onSubmit={SubmitPrompt}>
          <div className="w-full fixed left-0 bottom-0 mx-auto py-2 flex flex-col gap-1.5 px-4 bg-background">
            <div className="relative">
              <Textarea
                placeholder="Message ChatGPT..."
                name="message"
                value={input}
                {...(loading && { disabled: true })}
                onChange={(e) => setInput(e.target.value)}
                id="message"
                rows={1}
                className="overflow-hidden min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
              />
              <Button
                type="submit"
                {...(loading && { disabled: true })}
                size="icon"
                className="absolute w-8 h-8 top-3 right-3"
              >
                <ArrowUpIcon className="w-4 h-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
            <p className="text-xs font-medium text-center text-neutral-700">
              STARX GPT can make mistakes. Consider checking important
              information.
            </p>
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
      fill="purple"  // Set the background color to purple
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function BotIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="purple"  // Set the background color to purple
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
