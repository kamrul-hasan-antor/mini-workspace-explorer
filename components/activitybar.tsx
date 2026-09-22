"use client";

import { Files, Search } from "lucide-react";

export type SidebarPanel = "explorer" | "search";

const Activitybar = ({
  activePanel,
  onPanelChange,
}: {
  activePanel: SidebarPanel;
  onPanelChange: (panel: SidebarPanel) => void;
}) => {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center gap-2 border-r border-r-[var(--border)] bg-[var(--bg-activitybar)] pt-2">
      <ActivitybarItem
        icon={<Files className="size-5" />}
        title="Explorer"
        isActive={activePanel === "explorer"}
        onClick={() => onPanelChange("explorer")}
      />
      <ActivitybarItem
        icon={<Search className="size-5" />}
        title="Search"
        isActive={activePanel === "search"}
        onClick={() => onPanelChange("search")}
      />
    </div>
  );
};

const ActivitybarItem = ({
  icon,
  onClick,
  title,
  isActive,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
  isActive: boolean;
}) => {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded border-none p-2 outline-none ${
        isActive
          ? "border-l-2 border-l-[var(--text-primary)] bg-[#2a2a2a]"
          : "border-l-2 border-l-transparent hover:bg-[#2a2a2a]"
      }`}
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
    >
      {icon}
    </button>
  );
};

export default Activitybar;
