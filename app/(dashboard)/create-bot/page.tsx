"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import CreateBotWizard from "./components/CreateBotWizard";

export default function CreateBotPage() {
  return (
    <Layout>
      <div className="h-full bg-black">
        <CreateBotWizard />
      </div>
    </Layout>
  );
}