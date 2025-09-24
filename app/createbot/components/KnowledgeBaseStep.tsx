"use client";

import { Button } from "@/components/common/components/Button";
import { KnowledgeBaseItem, SimpleBotFormData } from "@/types/bot-creation";
import KnowledgeBaseItemCard from "./KnowledgeBaseItem";
import { Globe, MessageSquare, Plus, Sparkles, FileText } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
export default function KnowledgeBaseStep({
  formData,
  setFormData,
  error,
  handleAddKnowledge,
  handleRemoveKnowledge,
  handleSubmit,
  setStep,
  loading
}: {
  formData: SimpleBotFormData,
  setFormData: any,
  error: string,
  handleAddKnowledge: (type: "url" | "text") => void,
  handleRemoveKnowledge: (id: string) => void,
  handleSubmit: () => void,
  setStep: any,
  loading: boolean
}) {
  const [activeTab, setActiveTab] = useState<"url" | "text">("url");
  const [urlInput, setUrlInput] = useState("");
  const [textContent, setTextContent] = useState("");

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      // Create a temporary item to add to knowledge base
      const newItem: KnowledgeBaseItem = {
        id: Date.now().toString(),
        type: "url",
        content: urlInput,
        status: 'pending'
      };

      setFormData((prev: SimpleBotFormData) => ({
        ...prev,
        knowledgeBase: [...prev.knowledgeBase, newItem]
      }));

      setUrlInput(""); // Clear input after adding
    }
  };

  const handleAddTextContent = () => {
    if (textContent.trim()) {
      // Create a temporary item to add to knowledge base
      const newItem: KnowledgeBaseItem = {
        id: Date.now().toString(),
        type: "text",
        content: textContent,
        status: 'pending'
      };

      setFormData((prev: SimpleBotFormData) => ({
        ...prev,
        knowledgeBase: [...prev.knowledgeBase, newItem]
      }));

      setTextContent(""); // Clear editor after adding
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Add Knowledge</h1>
        <p className="text-gray-400">Train your bot with your content to make it smarter</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Tab Selection */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`flex items-center px-4 py-2 border-b-2 transition-colors ${activeTab === "url"
                ? "border-blue-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
              }`}
            onClick={() => setActiveTab("url")}
          >
            <Globe className="w-4 h-4 mr-2" />
            Website URL
          </button>
          <button
            className={`flex items-center px-4 py-2 border-b-2 transition-colors ${activeTab === "text"
                ? "border-blue-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
              }`}
            onClick={() => setActiveTab("text")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Text Content
          </button>
        </div>

        {/* Knowledge Base Items */}
        {formData.knowledgeBase.length > 0 && (
          <div className="space-y-3 mb-8">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Added Knowledge Sources</h3>
            {formData.knowledgeBase.map((item: KnowledgeBaseItem) => (
              <KnowledgeBaseItemCard key={item.id} item={item} onRemove={handleRemoveKnowledge} />
            ))}
          </div>
        )}

        {/* URL Input */}
        {activeTab === "url" && (
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="flex-1 px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                onClick={handleAddUrl}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!urlInput.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add URL
              </Button>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Add a website URL to scrape content from that page
            </p>
          </div>
        )}

        {/* Text Editor */}
        {activeTab === "text" && (
          <div className="mb-6">
            <div className="border border-gray-800 rounded-lg overflow-hidden">
              <ReactQuill
                value={textContent}
                onChange={setTextContent}
                placeholder="Enter or paste your text content here..."
                className="bg-black text-white border-none"
                theme="snow"
              />
              <div className="flex justify-end mt-2 items-end px-4 py-2 bg-gray-900 border-t border-gray-800">
                <Button
                  onClick={handleAddTextContent}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!textContent.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Add text content directly to train your bot
            </p>
          </div>
        )}



        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(2)} className="border-gray-800 text-gray-400 hover:text-white">
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || formData.knowledgeBase.length === 0}
            className="bg-green-600 hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create Bot</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}