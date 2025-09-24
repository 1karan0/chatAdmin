"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import BotHeader from "./components/BotHeader";
import BotTabs from "./components/BotTabs";
import SettingsTab from "./components/SettingsTab";
import AnalyticsTab from "./components/AnalyticsTab";
import DeployTab from "./components/DeployTab";
import { Bot } from "@/types";

export default function BotEditorPage() {
  const params = useParams();
  const router = useRouter();

  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    fetchBot();
  }, [params.botId]);

  const fetchBot = async () => {
    try {
      const response = await fetch(`/api/bots/${params.botId}`);
      if (response.ok) {
        const data = await response.json();
        setBot(data.bot);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching bot:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const saveBot = async () => {
    if (!bot) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/bots/${params.botId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bot),
      });
      if (response.ok) {
        const data = await response.json();
        setBot(data.bot);
      }
    } catch (err) {
      console.error("Error saving bot:", err);
    } finally {
      setSaving(false);
    }
  };

  const deployBot = async () => {
    if (!bot) return;
    setDeploying(true);
    try {
      const response = await fetch(`/api/bots/${params.botId}/deploy`, { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        setBot(data.bot);
      }
    } catch (err) {
      console.error("Error deploying bot:", err);
    } finally {
      setDeploying(false);
    }
  };

  const deleteBot = async () => {
    try {
      const response = await fetch(`/api/bots/${params.botId}`, { method: "DELETE" });
      if (response.ok) router.push("/dashboard");
    } catch (err) {
      console.error("Error deleting bot:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!bot) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Bot not found</h2>
            <button onClick={() => router.push("/dashboard")}>Go back to dashboard</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <BotHeader
          bot={bot}
          onSave={saveBot}
          saving={saving}
          onDeploy={deployBot}
          deploying={deploying}
          onDelete={deleteBot}
        />

        <BotTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1">
          {activeTab === "settings" && <SettingsTab bot={bot} setBot={setBot} />}
          {activeTab === "analytics" && <AnalyticsTab bot={bot} />}
          {activeTab === "deploy" && <DeployTab bot={bot} />}
        </div>
      </div>
    </Layout>
  );
}