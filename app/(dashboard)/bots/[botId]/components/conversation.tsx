"use client";

import { Bot } from "@/types";
import { BotMessageSquare, Clock, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ConversationProps {
  bot: Bot;
  conversation: any;
}

export default function Conversation({ bot, conversation }: ConversationProps) {
  const theme = bot?.theme;
  const [selected, setSelected] = useState<any>(null);
  const ITEMS_PER_PAGE = 5;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);


  useEffect(() => {
    if (!conversation) {
      setSelected(null);
      return;
    }

    if (Array.isArray(conversation.conversations)) {
      setSelected(conversation.conversations[0] || null);
      setVisibleCount(ITEMS_PER_PAGE); // reset pagination
    } else {
      setSelected(conversation);
    }
  }, [conversation]);

  useEffect(() => {
    if (!conversation) {
      setSelected(null);
      return;
    }

    if (Array.isArray(conversation.conversations)) {
      setSelected(conversation.conversations[0] || null);
    } else {
      setSelected(conversation);
    }
  }, [conversation]);

  const renderMessages = (conv: any) => {
    if (!conv)
      return <p className="text-sm text-gray-500">No conversation.</p>;

    if (!conv.messages || conv.messages.length === 0)
      return <p className="text-sm text-gray-500">No messages yet.</p>;

    return (
      <div className="flex flex-col space-y-4 pb-4">
        <div className="text-xs text-center text-gray-500 mb-2">
          {conv.created_at
            ? new Date(conv.created_at).toLocaleString()
            : ""}
        </div>

        {conv.messages.map((msg: any, idx: number) => {
          const isUser = msg.role === "user";

          const bubbleStyle: React.CSSProperties = {
            backgroundColor: isUser
              ? theme?.primaryColor || "#667eea"
              : theme?.secondaryColor || "#f3f4f6",
            color: isUser
              ? theme?.yourtextColor || "#ffffff"
              : theme?.chattextColor || "#1a1a1a",
            borderRadius: "16px",
            padding: "0.6rem 1rem",
            wordBreak: "break-word",
          };

          return (
            <div
              key={idx}
              className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"
                }`}
            >
              {/* Bot Avatar */}
              {!isUser && (
                <div
                  className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme?.primaryColor }}
                >
                  <BotMessageSquare size={16} />
                </div>
              )}

              {/* Message + Images */}
              <div className="max-w-[75%] flex flex-col">
                {/* Text Bubble */}
                {msg.text && (
                  <div style={bubbleStyle} className="text-sm leading-relaxed">
                    {msg.text}
                  </div>
                )}

                {/* Images */}
                {msg.images && msg.images.length > 0 && (
                  <div className="mt-2 grid gap-2 grid-cols-1 sm:grid-cols-2">
                    {msg.images.map((img: any, i: number) => (
                      <div
                        key={i}
                        className="relative w-full h-48 rounded-xl overflow-hidden"
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div
                  className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme?.primaryColor }}
                >
                  <User size={16} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  // if (conversation.conversations && conversation.conversations.length === 0)
  //     return <div className="flex w-full h-full items-center justify-center">
  //       <p className="text-sm text-gray-500">No conversation yet.</p>
  //     </div>;


  return (
    <div
      className="p-4 overflow-hidden"
      style={{
        fontFamily: theme?.fontFamily || undefined,
        fontSize: theme?.fontSize || undefined,
      }}
    >
      <div className="md:p-6">
        {Array.isArray(conversation?.conversations) ? (
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Conversation List */}
            <div className="md:border-r md:pr-4 space-y-2 md:w-[70%] lg:max-w-[40%] xl:max-w-[30%] max-h-[70vh] overflow-y-auto">
              {conversation.conversations
                .slice(0, visibleCount)
                .map((c: any) => (
                  <div
                    key={c.conversation_id}
                    onClick={() => setSelected(c)}
                    className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-all duration-300 ${selected?.conversation_id === c.conversation_id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-700 hover:border-neutral-500 hover:bg-zinc-800"
                      }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${selected?.conversation_id === c.conversation_id
                        ? "bg-blue-500"
                        : "bg-zinc-700"
                        }`}
                    >
                      <Clock
                        size={16}
                        className={
                          selected?.conversation_id === c.conversation_id
                            ? "text-white"
                            : ""
                        }
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xs font-semibold">
                        {new Date(c.created_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[180px]">
                        {c.preview}
                      </div>
                    </div>
                  </div>
                ))}
              {visibleCount < conversation.conversations.length && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  className="w-full mt-3 py-2 text-sm rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                >
                  Load More
                </button>
              )}
            </div>

            {/* Chat Window */}
            <div className="flex justify-center w-full mt-6 md:mt-0">
              <div
                className="w-full  lg:w-1/2 p-4 rounded-lg shadow-lg h-[60vh] overflow-y-auto"
                style={{ backgroundColor: theme?.backgroundColor }}
              >
                {renderMessages(selected)}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-full rounded-lg shadow-lg h-[70vh] overflow-y-auto"
            style={{ backgroundColor: theme?.backgroundColor }}
          >
            {renderMessages(conversation)}
          </div>
        )}
      </div>
    </div>
  );
}