"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Globe, FileText, Upload, Plus, Trash2, AlertCircle, File } from "lucide-react";
import { Button } from "@/components/common/components/Button";
import toast, { Toaster } from "react-hot-toast";
import { Bot } from "@/types";

export default function AddKnowledgePage({ bot }: { bot: Bot }) {
  const { botId } = useParams(); // 🧩 get bot ID from URL
  const [activeTab, setActiveTab] = useState<"url" | "text" | "file">("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [knowledgeItems, setKnowledgeItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const backendurl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const supportedFileTypes = [
    { type: 'pdf', label: 'PDF Documents', accept: '.pdf', mime: 'application/pdf' },
    { type: 'docx', label: 'Word Documents', accept: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { type: 'txt', label: 'Text Files', accept: '.txt', mime: 'text/plain' },
    { type: 'csv', label: 'CSV Files', accept: '.csv', mime: 'text/csv' },
    { type: 'json', label: 'JSON Files', accept: '.json', mime: 'application/json' },
  ];


  // Add URL
  const addUrl = async () => {
    if (!urlInput.trim()) return;

    try {
      const formData = new FormData();
      formData.append("url", urlInput.trim());
      formData.append("tenant_id", bot.tenant_id);

      const res = await fetch(`${backendurl}/knowledge/sources/url`, {
        method: "POST",
        body: formData, // ✅ send as FormData, not JSON
      });

      if (!res.ok) throw new Error("Invalid URL");
      const data = await res.json();

      toast.success("URL added successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Invalid or failed URL");
    }

    const newItem = {
      id: Date.now().toString(),
      type: "url",
      content: urlInput.trim(),
      title: urlInput.trim(),
    };
    setKnowledgeItems([...knowledgeItems, newItem]);
    setUrlInput("");

  };

  // Add Text
  const addText = async () => {
    if (!textInput.trim()) return;

    try {
      const formData = new FormData();
      formData.append("text", textInput.trim());
      formData.append("tenant_id", bot.tenant_id);
      const result = await fetch(`${backendurl}/knowledge/sources/text`, {
        method: "POST",
        body: formData,
      });
      if (!result.ok) throw new Error("Failed to add text knowledge");
      const data = await result.json();
      toast.success("Text knowledge added successfully!");
    }
    catch (err) {
      console.error(err);
      toast.error("Failed to add text knowledge");
    }
    const newItem = {
      id: Date.now().toString(),
      type: "text",
      title: textTitle || "Text Entry",
      content: textInput.trim(),
    };
    setKnowledgeItems([...knowledgeItems, newItem]);
    setTextInput("");
    setTextTitle("");
  };

  const addFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenant_id", bot?.tenant_id); // must match FastAPI Form field

      const res = await fetch(`${backendurl}/knowledge/sources/file`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to upload file");
      }

      const data = await res.json();
      console.log("File upload response:", data);
      toast.success("File uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload file");
    }
  };
  // Add File
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const newItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        type: "file",
        title: file.name,
        content: file.name,
        file,
        fileSize: file.size,
        mimeType: file.type,
      };
      addFile(file); // Upload file to backend
      setKnowledgeItems((prev) => [...prev, newItem]);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  //  Remove
  const removeItem = (id: string) => {
    setKnowledgeItems((prev) => prev.filter((item) => item.id !== id));
  };

  //  Submit to API
  const handleSubmit = async () => {
    if (knowledgeItems.length === 0) {
      toast.error("Add at least one knowledge source first!");
      return;
    }

    setLoading(true);
    try {
      for (const item of knowledgeItems) {
        const payload = {
          title: item.title,
          content: item.content,
          metadata: { source: item.type },
          filePath: null,
          fileSize: item.fileSize || null,
          mimeType: item.mimeType || null,
          sourceUrl: item.type === "url" ? item.content : null,
          status: "READY",
          type: item.type.toUpperCase(),
        };

        await fetch(`${backendurl}/knowledge/rebuild-index?tenant_id=${bot?.tenant_id}`, {
          method: "POST",
        });

        const res = await fetch(`/api/bots/${botId}/addknowledge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to save knowledge item");
      }

      toast.success("Knowledge added successfully! ✨");
      setKnowledgeItems([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <Toaster />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Add Knowledge to Bot</h1>
        <p className="text-zinc-400">Upload files, add URLs, or paste text — your bot will learn from it.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-700">
        {[
          { key: "url", icon: <Globe className="w-4 h-4 mr-2" />, label: "Website URLs" },
          { key: "text", icon: <FileText className="w-4 h-4 mr-2" />, label: "Text Content" },
          { key: "file", icon: <Upload className="w-4 h-4 mr-2" />, label: "Upload Files" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center px-6 py-3 border-b-2 transition-colors ${activeTab === tab.key
              ? "border-blue-500 text-white"
              : "border-transparent text-zinc-400 hover:text-white"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* URL TAB */}
      {activeTab === "url" && (
        <div className="bg-zinc-800/50 p-6 rounded-lg space-y-4">
          <h3 className="text-white font-semibold">Add Website URL</h3>
          <div className="flex gap-3">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={addUrl} disabled={!urlInput.trim()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add URL
            </Button>
          </div>
        </div>
      )}

      {/* TEXT TAB */}
      {activeTab === "text" && (
        <div className="bg-zinc-800/50 p-6 rounded-lg space-y-4">
          <h3 className="text-white font-semibold">Add Text Knowledge</h3>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={6}
            placeholder="Paste your content here..."
            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 resize-none"
          />
          <Button onClick={addText} disabled={!textInput.trim()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Add Text
          </Button>
        </div>
      )}

      {/* FILE TAB */}
      {activeTab === 'file' && (
        <div className="space-y-4">
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Documents</h3>

            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-zinc-600 hover:border-zinc-500'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-zinc-400 mb-4">
                Supports PDF, Word, Text, CSV, and JSON files (max 10MB each)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.csv,.json"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>

            {/* Supported File Types */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-zinc-300 mb-3">Supported File Types:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {supportedFileTypes.map((fileType) => (
                  <div key={fileType.type} className="flex items-center space-x-2 text-sm text-zinc-400">
                    <File className="w-4 h-4" />
                    <span>{fileType.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADDED ITEMS */}
      {knowledgeItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Knowledge Sources</h3>
          {knowledgeItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                {item.type === "url" ? (
                  <Globe className="w-5 h-5 text-blue-400" />
                ) : item.type === "text" ? (
                  <FileText className="w-5 h-5 text-green-400" />
                ) : (
                  <File className="w-5 h-5 text-purple-400" />
                )}
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-sm text-zinc-400">
                    {item.type.toUpperCase()}{" "}
                    {item.fileSize ? `• ${(item.fileSize / 1024).toFixed(1)} KB` : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Empty State */}
      {knowledgeItems.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-zinc-600 rounded-lg">
          <div className="flex justify-center space-x-4 mb-4">
            <Globe className="w-5 h-5 text-zinc-500" />
            <FileText className="w-5 h-5 text-zinc-500" />
            <Upload className="w-5 h-5 text-zinc-500" />
          </div>
          <h3 className="text-sm font-medium text-zinc-400 mb-2">No knowledge sources added</h3>
          <p className="text-zinc-500 text-xs">Add websites, upload documents, or paste text to train your bot</p>
        </div>
      )}

      {/* SUBMIT */}
      <div className="text-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 text-white font-medium rounded-lg ${loading ? "bg-zinc-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Saving..." : "Save Knowledge to Bot"}
        </Button>
      </div>
    </div>
  );
}
