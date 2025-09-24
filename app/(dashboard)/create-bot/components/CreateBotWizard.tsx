"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bot, CheckCircle, FileText, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/common/components/Button";
import BotTypeStep from "./steps/BotTypeStep";
import KnowledgeStep from "./steps/KnowledgeStep";
import ThemeStep from "./steps/ThemeStep";
import ReviewStep from "./steps/ReviewStep";

export interface BotFormData {
  // Basic Info
  name: string;
  description: string;
  botType: string;

  // Knowledge Base
  knowledgeBase: Array<{
    id: string;
    type: 'url' | 'text' | 'file' | 'pdf' | 'docx' | 'txt' | 'csv' | 'json';
    content: string;
    title?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'indexed';
    file?: File;
    fileSize?: number;
    mimeType?: string;
  }>;

  // Theme Configuration
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: string;
    borderRadius: string;
    chatPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    chatWidth: string;
    chatHeight: string;
    customCSS?: string;
  };

  // Advanced
  isPublic: boolean;
  tags: string[];
}

const initialFormData: BotFormData = {
  name: "",
  description: "",
  botType: "",
  knowledgeBase: [],
  theme: {
    primaryColor: "#0ea5e9",
    secondaryColor: "#64748b",
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    fontFamily: "Inter",
    fontSize: "14px",
    borderRadius: "8px",
    chatPosition: "bottom-right",
    chatWidth: "400px",
    chatHeight: "600px",
    customCSS: "",
  },
  isPublic: false,
  tags: [],
};

const steps = [
  { id: 1, name: "Bot Type", description: "Choose your bot's purpose", icon: <Bot /> },
  { id: 2, name: "Knowledge", description: "Add training data", icon: <FileText /> },
  { id: 3, name: "Theme", description: "Customize appearance", icon: <Settings /> },
  { id: 4, name: "Review", description: "Review and create", icon: <CheckCircle /> },
];

export default function CreateBotWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BotFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFormData = (field: keyof BotFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.botType && formData.name.trim());
      case 2:
        return true; // Knowledge base is optional
      case 3:
        return !!(formData.theme.primaryColor && formData.theme.backgroundColor);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
  if (!validateStep(currentStep)) return;

  setLoading(true);
  setError("");

  try {
    const response = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        config: { botType: formData.botType, tags: formData.tags },
        theme: formData.theme,
        isPublic: formData.isPublic,
        knowledgeBase: formData.knowledgeBase,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to create bot");
      return;
    }

    // === Extract IDs safely ===
    const botId = data?.bot?.id;
    const knowledgeBases = Array.isArray(data?.bot?.knowledgeBase)
      ? data.bot.knowledgeBase
      : [];

    // Navigate to bot page
    if (botId) router.push(`/bots/${botId}`);

    // Optional: get current processing status for the bot
    if (botId) {
      const statusRes = await fetch(`/api/knowledge/process?botId=${botId}`, { method: "GET" });
      const statusJson = await statusRes.json();
      console.log("Processing status:", statusJson);
    }

    // Trigger processing for each knowledgeBase item (POST per item)
    if (knowledgeBases.length > 0) {
      await Promise.all(
        knowledgeBases.map((kb:any) =>
          fetch("/api/knowledge/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ botId, knowledgeBaseId: kb.id }),
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to process KB ${kb.id}`);
            return res.json();
          })
        )
      );
      console.log(`Triggered processing for ${knowledgeBases.length} KB items`);
    } else {
      console.log("No knowledgeBase items returned with bot creation.");
    }

  } catch (err) {
    console.error(err);
    setError("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BotTypeStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <KnowledgeStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <ThemeStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-black flex flex-col items-center gap-6 py-3">

      {/* Progress Bar */}
      <div className="md:border w-[15%] md:border-zinc-800 rounded-full">
        <div className="p-4">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 p-2 rounded-full flex items-center justify-center  ${step.id === currentStep
                      ? "bg-blue-600 text-white"
                      : step.id < currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-700 text-zinc-400"
                    }`}
                >
                  {step.id < currentStep ? "✓" : step.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-3">
        {renderStep()}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-700">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="border-zinc-600 text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !validateStep(currentStep)}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Bot
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}