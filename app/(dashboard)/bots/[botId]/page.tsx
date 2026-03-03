"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "@/components/layout/Layout";
import BotHeader from "./components/BotHeader";
import BotTabs from "./components/BotTabs";
import SettingsTab from "./components/SettingsTab";
import AnalyticsTab from "./components/AnalyticsTab";
import DeployTab from "./components/DeployTab";
import { Bot } from "@/types";
import Addknowledge from "./components/AddKnowledge";
import Conversation from "./components/conversation";

export default function BotEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const sessionId = session?.user?.id || null;

  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  // unique chat session we get from the Python backend and persist per tenant
  const [chatSessionId, setChatSessionId] = useState<string>("");


  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [deletLoading, setDeleteLoading] = useState(false);
  const [conversation, setConversation] = useState<any>(null);

    useEffect(() => {
    if (!bot?.tenant_id) return;

    const key = `chatSession_`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setChatSessionId(stored);
      return;
    }

    fetch(`${backendBase}/chat/session?tenant_id=${bot.tenant_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.session_id) {
          localStorage.setItem(key, data.session_id);
          setChatSessionId(data.session_id);
        }
      })
      .catch((err) => console.error("failed to init chat session", err));
  }, [bot?.tenant_id]);

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
      setDeleteLoading(true);
      const response = await fetch(`/api/bots/${params.botId}`, { method: "DELETE" });
      if (response.ok)
         await fetch(`${backendBase}/auth/tenants/${bot?.tenant_id}`, { method: "DELETE" });
        setDeleteLoading(false);
        router.push("/dashboard");
    } catch (err) {
      setDeleteLoading(false);
      console.error("Error deleting bot:", err);
    }
  };

  const getConversation = async () => {
    if (!bot?.tenant_id || !chatSessionId) return;

    try {
      const url = new URL(`${backendBase}/chat/conversations`);
      url.searchParams.set("tenant_id", bot.tenant_id);
      

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setConversation(data);
      }
    } catch (err) {
      console.error("Error fetching conversation:", err);
    }
  };

  // fetch conversation whenever tenant or chat session changes
  useEffect(() => {
    getConversation();
  }, [bot?.tenant_id, chatSessionId]);

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
          deleteLoading={deletLoading}
        />

        <BotTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1">
          {activeTab === "settings" && <SettingsTab bot={bot} setBot={setBot} />}
          {activeTab === "analytics" && <AnalyticsTab bot={bot} />}
          {activeTab === "deploy" && <DeployTab bot={bot} />}
          {activeTab === "integrations" && <Addknowledge bot = {bot}/>}
          {activeTab === "conversation" && <Conversation bot={bot} conversation={conversation} />}
        </div>
      </div>
    </Layout>
  );
}