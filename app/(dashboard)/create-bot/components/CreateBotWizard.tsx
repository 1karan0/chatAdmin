"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle,
  FileText,
  Settings,
  Sparkles,
} from "lucide-react";
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
  tenantId?: string;

  // Knowledge Base
  knowledgeBase: Array<{
    id: string;
    type: "url" | "text" | "file" | "pdf" | "docx" | "txt" | "csv" | "json";
    content: string;
    title?: string;
    status: "pending" | "processing" | "completed" | "failed" | "indexed";
    file?: File;
    fileSize?: number;
    mimeType?: string;
  }>;

  // Theme Configuration
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    yourtextColor: string;
    chattextColor: string;
    bottomColor: string;
    FontFamily: string;
    fontSize: string;
    borderRadius: string;
    chatPosition: "bottom-right" | "bottom-left" | "top-right" | "top-left";
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
    yourtextColor: "#1e293b",
    chattextColor: "#1e293b",
    bottomColor: "#0ea5e9",
    FontFamily: "Inter",
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.botType && formData.name.trim());
      case 2:
        return true;
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
      // Generate tenant ID
      const tenantId = crypto.randomUUID();
      const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const secret = process.env.NEXT_PUBLIC_INTERNAL_API_KEY || "";

      // === 1️⃣ Create Tenant in FastAPI ===
      const tenantRes = await fetch(`${backendBase}/auth/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": secret,
        },
        body: JSON.stringify({
          tenant_id: tenantId,
          tenant_name: `${formData.name}-tenant`,
          username: "frontend_user",
        }),
      });

      if (!tenantRes.ok) {
        throw new Error("Failed to create tenant in backend");
      }

      // === 2️⃣ Add Knowledge Sources ===
      const kbList = formData.knowledgeBase;
      for (const kb of kbList) {
        if (kb.type === "url") {
          const form = new FormData();
          form.append("urls", JSON.stringify([kb.content]));
          form.append("tenant_id", tenantId);
          await fetch(`${backendBase}/knowledge/sources/urls/batch`, { method: "POST", body: form });
        } else if (kb.type === "text") {
          const form = new FormData();
          form.append("tenant_id", tenantId);
          form.append("text", kb.content);
          form.append("title", kb.title || "Untitled Text");
          await fetch(`${backendBase}/knowledge/sources/text`, { method: "POST", body: form });
        } else if (kb.type === "file" && kb.file) {
          const form = new FormData();
          form.append("tenant_id", tenantId);
          form.append("files", kb.file);
          await fetch(`${backendBase}/knowledge/sources/files/batch`, { method: "POST", body: form });
        }
      }

      // === 3️⃣ Create Bot in Next.js Prisma ===
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
          tenant_id: tenantId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to create bot");
        return;
      }

      const botId = data?.bot?.id;
      if (botId) router.push(`/bots/${botId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unexpected error occurred");
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
      {/* Progress */}
      <div className="md:border w-[15%] md:border-zinc-800 rounded-full">
        <div className="p-4">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 p-2 rounded-full flex items-center justify-center ${step.id === currentStep
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
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
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
                  <Sparkles className="w-4 h-4 mr-2" /> Create Bot
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
