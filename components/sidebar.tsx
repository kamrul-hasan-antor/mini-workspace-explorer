"use client";

import { useWorkspaceContext } from "@/context/workspaceProvider";
import { itemType } from "@/lib/types";
import {
  ChevronDown,
  ChevronRight,
  CopyMinus,
  File,
  FilePlusCorner,
  Folder,
  FolderPlus,
  RotateCw,
} from "lucide-react";

const Sidebar = () => {
  const { workspaceData, toggleFolder } = useWorkspaceContext();
  const itemArray = buildItemArray(workspaceData.items);

  const selectedId = workspaceData.selectedFolderId || workspaceData.openFileId;

  return (
    <div className="group min-h-0 border-r border-r bg-[var(--bg-sidebar)] md:w-[260px] border-r-[var(--border)]">
      <div className="h-8 flex items-center px-3 border-b border-b-[var(--border)]">
        <ActionArea />
      </div>
      <div className="py-2">
        {itemArray.map((item) => (
          <TreeItem
            key={item.id}
            item={item}
            depth={0}
            expandedFolderIds={workspaceData.expandedFolderIds}
            onToggleFolder={toggleFolder}
            selectedId={selectedId}
          />
        ))}
      </div>
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

function TreeItem({
  item,
  depth,
  expandedFolderIds,
  onToggleFolder,
  selectedId,
}: {
  item: itemType;
  depth: number;
  expandedFolderIds: string[];
  onToggleFolder: (id: string, isFolder: boolean) => void;
  selectedId: string | null;
}) {
  const isFolder = item.type === "folder";
  const isExpanded = expandedFolderIds.includes(item.id);

  return (
    <>
      <div
        className={`flex min-w-0 cursor-pointer items-center gap-1 px-1 py-0.5 hover:bg-[var(--bg-activitybar)] ${selectedId === item.id ? "bg-[var(--bg-activitybar)]" : ""}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => {
          onToggleFolder(item.id, isFolder);
        }}
      >
        {isFolder ? (
          isExpanded ? (
            <ChevronDown className="size-3.5 shrink-0 text-[var(--text-muted)]" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0 text-[var(--text-muted)]" />
          )
        ) : (
          <span className="size-3.5 shrink-0" aria-hidden />
        )}

        {isFolder ? (
          <Folder className="size-3.5 shrink-0 fill-[#dcb67a] stroke-[#dcb67a]" />
        ) : (
          <File className="size-4 shrink-0" />
        )}

        <p className="min-w-0 truncate truncate select-none">{item.name}</p>
      </div>

      {isFolder && isExpanded
        ? item.children?.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              expandedFolderIds={expandedFolderIds}
              onToggleFolder={onToggleFolder}
              selectedId={selectedId}
            />
          ))
        : null}
    </>
  );
}

function buildItemArray(data: Record<string, itemType>): itemType[] {
  const items = Object.values(data);

  const itemMap = new Map<string, itemType>();

  items.forEach((item) => {
    itemMap.set(item.id, {
      ...item,
      children: item.type === "folder" ? [] : undefined,
    });
  });

  const roots: itemType[] = [];

  items.forEach((item) => {
    const currentItem = itemMap.get(item.id)!;

    if (item.parentId === null) {
      roots.push(currentItem);
      return;
    }

    const parent = itemMap.get(item.parentId);

    if (parent?.type === "folder") {
      parent.children?.push(currentItem);
    }
  });

  return roots;
}

export default Sidebar;
