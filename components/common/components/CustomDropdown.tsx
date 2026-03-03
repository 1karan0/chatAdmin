import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  name: string;
  icon: LucideIcon;
}

export default function CustomDropdown({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const active = tabs.find((tab) => tab.id === activeTab);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-zinc-900 text-zinc-200 px-4 py-3 rounded-lg border border-zinc-700"
      >
        <div className="flex items-center gap-2">
          {active && <active.icon className="w-4 h-4" />}
          <span>{active?.name}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-left text-sm transition ${
                activeTab === tab.id
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}