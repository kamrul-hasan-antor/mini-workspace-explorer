"use client";

import {
  CopyMinus,
  FilePlusCorner,
  Folder,
  FolderPlus,
  RotateCw,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="group min-h-0 border-r border-r bg-[var(--bg-sidebar)] md:w-[260px] border-r-[var(--border)]">
      <div className="h-8 flex items-center px-3 border-b border-b-[var(--border)]">
        <ActionArea />
      </div>
      <Folder className="size-4 fill-[#dcb67a] stroke-[#dcb67a]" />
    </div>
  );
};

const ActionArea = () => {
  return (
    <div className="flex items-center justify-between">
      <p className="min-w-0 flex-1 truncate text-xs text-[var(--text-muted)]">
        Mini Workspace Explorer
      </p>
      <div className="hidden group-hover:flex items-center flex-1 justify-end">
        <ActionButton
          icon={<FilePlusCorner className="size-3.5" />}
          onClick={() => {}}
          title="New File"
        />
        <ActionButton
          icon={<FolderPlus className="size-3.5" />}
          onClick={() => {}}
          title="New File"
        />
        <ActionButton
          icon={<RotateCw className="size-3.5 -rotate-180" />}
          onClick={() => {}}
          title="Reset"
        />
        <ActionButton
          icon={<CopyMinus className="size-3.5 scale-x-[-1]" />}
          onClick={() => {}}
          title="Collapse All"
        />
      </div>
    </div>
  );
};

const ActionButton = ({
  icon,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}) => {
  return (
    <button
      className="hover:bg-[var(--bg-activitybar)] rounded cursor-pointer px-1.5 py-1 outline-none border-none"
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      {icon}
    </button>
  );
};

export default Sidebar;
