"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/common/components/Button";

export default function Header({ step, setStep, router }: any) {
  return (
    <div className="bg-black border-b border-gray-800 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => step > 1 ? setStep(step - 1) : router.push('/')}
          className="text-gray-400 hover:text-white flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step > 1 ? 'Back' : 'Back to Dashboard'}
        </Button>
        <div className="text-sm text-gray-400">Step {step} of 3</div>
      </div>
    </div>
  );
}
