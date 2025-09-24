"use client";

import { useState } from "react";
import { Globe, FileText, Plus, Trash2, Upload, Link, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/common/components/Button";
import { BotFormData } from "../CreateBotWizard";

interface Props {
  formData: BotFormData;
  updateFormData: (field: keyof BotFormData, value: any) => void;
}

export default function KnowledgeStep({ formData, updateFormData }: Props) {
  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'file'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [dragActive, setDragActive] = useState(false);

  const supportedFileTypes = [
    { type: 'pdf', label: 'PDF Documents', accept: '.pdf', mime: 'application/pdf' },
    { type: 'docx', label: 'Word Documents', accept: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { type: 'txt', label: 'Text Files', accept: '.txt', mime: 'text/plain' },
    { type: 'csv', label: 'CSV Files', accept: '.csv', mime: 'text/csv' },
    { type: 'json', label: 'JSON Files', accept: '.json', mime: 'application/json' },
  ];

  const addUrl = () => {
    if (!urlInput.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      type: 'url' as const, 
      content: urlInput.trim(),
      status: 'pending' as const,
    };

    
    updateFormData('knowledgeBase', [...formData.knowledgeBase, newItem]);
    setUrlInput('');
  };

  const addText = () => {
    if (!textInput.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      type: 'text' as const,
      content: textInput.trim(),
      title: textTitle.trim() || 'Text Content',
      status: 'pending' as const,
    };

    updateFormData('knowledgeBase', [...formData.knowledgeBase, newItem]);
    setTextInput('');
    setTextTitle('');
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Validate file type
      const isSupported = supportedFileTypes.some(type => 
        file.type === type.mime || file.name.toLowerCase().endsWith(type.accept.substring(1))
      );

      if (!isSupported) {
        alert(`File type not supported: ${file.name}`);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File too large: ${file.name}. Maximum size is 10MB.`);
        return;
      }

      const fileType = file.type.includes('pdf') ? 'pdf' :
                      file.type.includes('word') ? 'docx' :
                      file.type.includes('text') ? 'txt' :
                      file.type.includes('csv') ? 'csv' :
                      file.type.includes('json') ? 'json' : 'file';

      const newItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        type: fileType as any,
        content: file.name,
        title: file.name,
        status: 'pending' as const,
        file: file,
        fileSize: file.size,
        mimeType: file.type,
      };

      updateFormData('knowledgeBase', [...formData.knowledgeBase, newItem]);
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

  const removeItem = (id: string) => {
    updateFormData('knowledgeBase', formData.knowledgeBase.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 w-full">
      <div className="text-center mb-8">
      
        <h2 className="text-2xl font-bold text-white mb-2">Add Knowledge Sources</h2>
        <p className="text-zinc-400">Upload documents, add websites, or paste text to train your bot</p>
      </div>

      {/* Tab Selection */}
      <div className="flex w-full border-b border-zinc-800 mb-6">
        <button
          className={`flex items-center px-6 py-3 border-b-2 transition-colors ${
            activeTab === 'url'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('url')}
        >
          <Globe className="w-4 h-4 mr-2" />
          Website URLs
        </button>
        <button
          className={`flex items-center px-6 py-3 border-b-2 transition-colors ${
            activeTab === 'text'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('text')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Text Content
        </button>
        <button
          className={`flex items-center px-6 py-3 border-b-2 transition-colors ${
            activeTab === 'file'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('file')}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </button>
      </div>

      {/* URL Tab */}
      {activeTab === 'url' && (
        <div className="space-y-4">
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Add Website URL</h3>
            <div className="flex gap-3">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                onClick={addUrl}
                disabled={!urlInput.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add URL
              </Button>
            </div>
            <p className="text-sm text-zinc-500 mt-2">
              Our Python backend will crawl and extract content from this website
            </p>
          </div>
        </div>
      )}

      {/* Text Tab */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Add Text Content</h3>
            <div className="space-y-4">
              <div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your text content here..."
                  rows={6}
                  className="w-full px-4 py-3 bg-black border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <Button
                onClick={addText}
                disabled={!textInput.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Text
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Tab */}
      {activeTab === 'file' && (
        <div className="space-y-4">
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Documents</h3>
            
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
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
                Choose Files
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

      {/* Knowledge Base Items */}
      {formData.knowledgeBase.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Added Knowledge Sources</h3>
          <div className="space-y-3">
            {formData.knowledgeBase.map((item) => (
              <div key={item.id} className="bg-zinc-800/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {item.type === 'url' ? (
                    <Link className="w-5 h-5 text-blue-400" />
                  ) : item.type === 'text' ? (
                    <FileText className="w-5 h-5 text-green-400" />
                  ) : (
                    <File className="w-5 h-5 text-purple-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {item.title || item.content}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {item.type === 'url' ? item.content : 
                       item.type === 'text' ? `${item.content.substring(0, 100)}...` :
                       `${item.type.toUpperCase()} • ${item.fileSize ? Math.round(item.fileSize / 1024) + ' KB' : ''}`}
                    </p>
                    {item.status === 'processing' && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-blue-400">Processing...</span>
                      </div>
                    )}
                    {item.status === 'failed' && (
                      <div className="flex items-center space-x-2 mt-1">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span className="text-xs text-red-400">Processing failed</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {formData.knowledgeBase.length === 0 && (
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
    </div>
  );
}