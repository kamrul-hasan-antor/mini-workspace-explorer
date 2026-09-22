"use client";

import { useWorkspaceContext } from "@/context/workspaceProvider";
import { createItems } from "@/lib/data";
import { fileType, itemType } from "@/lib/types";
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
import { useState } from "react";

const Sidebar = () => {
  const [newItemName, setNewItemName] = useState("");
  const { workspaceData, toggleFolder, expandFolder, setWorkspaceData } =
    useWorkspaceContext();
  const itemArray = buildItemArray(workspaceData.items);

  const selectedId = workspaceData.selectedFolderId || workspaceData.openFileId;

  const handleAddNewItem = (
    selectedId: string,
    type: fileType,
    name: string,
    isNew: boolean,
  ) => {
    if (isNew) {
      console.log(name);
      setNewItemName(name);
    }

    const crrSelectedItem = workspaceData.items[selectedId];

    const parentId =
      crrSelectedItem.type === "folder"
        ? crrSelectedItem.id
        : crrSelectedItem.parentId;

    const newItem = {
      id: new Date().getTime().toString(),
      name,
      type,
      parentId,
      ...(crrSelectedItem.type === "folder"
        ? { children: [] }
        : { content: "" }),
      ...(isNew ? { isNew } : {}),
    };

    setWorkspaceData({
      ...workspaceData,
      items: {
        ...workspaceData.items,
        [newItem.id]: newItem,
      },
    });
  };

  const handleUpdateNewItemName = (newItem: itemType) => {
    setWorkspaceData({
      ...workspaceData,
      items: {
        ...workspaceData.items,
        [newItem.id]: newItem,
      },
    });
  };

  return (
    <div className="group min-h-0 border-r border-r bg-[var(--bg-sidebar)] md:w-[260px] border-r-[var(--border)]">
      <div className="h-8 flex items-center px-3 border-b border-b-[var(--border)]">
        <ActionArea onAddNewItem={handleAddNewItem} selectedId={selectedId} />
      </div>
      <div className="py-2">
        {itemArray.map((item) => (
          <TreeItem
            key={item.id}
            item={item}
            depth={0}
            expandedFolderIds={workspaceData.expandedFolderIds}
            onToggleFolder={toggleFolder}
            onExpandFolder={expandFolder}
            selectedId={selectedId}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            onUpdateNewItemName={handleUpdateNewItemName}
          />
        ))}
      </div>
    </div>
  );
};

const ActionArea = ({
  onAddNewItem,
  selectedId,
}: {
  onAddNewItem: (
    selectedId: string,
    type: fileType,
    name: string,
    isNew: boolean,
  ) => void;
  selectedId: string | null;
}) => {
  const { setWorkspaceData } = useWorkspaceContext();

  const handleReset = () => {
    const initial = {
      items: createItems(),
      selectedFolderId: "workspace",
      openFileId: null,
      expandedFolderIds: ["workspace", "projects", "webbly"],
    };
    setWorkspaceData(initial);
  };

  return (
    <div className="flex items-center justify-between">
      <p className="min-w-0 flex-1 truncate text-xs text-[var(--text-muted)]">
        Mini Workspace Explorer
      </p>
      <div className="hidden group-hover:flex items-center flex-1 justify-end">
        <ActionButton
          icon={<FilePlusCorner className="size-3.5" />}
          onClick={() => {
            onAddNewItem(selectedId || "", "file", "untitled.txt", true);
          }}
          title="New File"
        />
        <ActionButton
          icon={<FolderPlus className="size-3.5" />}
          onClick={() => {
            onAddNewItem(selectedId || "", "folder", "new folder", true);
          }}
          title="New File"
        />
        <ActionButton
          icon={<RotateCw className="size-3.5 -rotate-180" />}
          onClick={() => {
            handleReset();
          }}
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
  onExpandFolder,
  selectedId,
  newItemName,
  setNewItemName,
  onUpdateNewItemName,
}: {
  item: itemType;
  depth: number;
  expandedFolderIds: string[];
  onToggleFolder: (id: string, isFolder: boolean) => void;
  onExpandFolder: (id: string) => void;
  selectedId: string | null;
  newItemName: string;
  setNewItemName: (name: string) => void;
  onUpdateNewItemName: (newItem: itemType) => void;
}) {
  const isFolder = item.type === "folder";
  const isExpanded = expandedFolderIds.includes(item.id);
  const isNew = "isNew" in item && item.isNew;
  return (
    <>
      <div
        className={`flex min-w-0 cursor-pointer items-center gap-1 px-1 py-0.5 hover:bg-[var(--bg-workspace-header)] ${selectedId === item.id ? "bg-[var(--bg-activitybar)]" : ""}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => {
          onToggleFolder(item.id, isFolder);
        }}
      >
        {isFolder ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onExpandFolder(item.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="size-3.5 shrink-0 text-[var(--text-muted)]" />
            ) : (
              <ChevronRight className="size-3.5 shrink-0 text-[var(--text-muted)]" />
            )}
          </div>
        ) : (
          <span className="size-3.5 shrink-0" aria-hidden />
        )}

        {isFolder ? (
          <Folder className="size-3.5 shrink-0 fill-[#dcb67a] stroke-[#dcb67a]" />
        ) : (
          <File className="size-4 shrink-0" />
        )}

        {isNew ? (
          <input
            autoFocus
            value={newItemName}
            onChange={(e) => {
              setNewItemName(e.target.value);
            }}
            onBlur={(e) => {
              console.log(item);
              return;
              onUpdateNewItemName({
                ...item,
                name: e.target.value,
                isNew: false,
              });
            }}
            type="text"
            className="w-full border outline-none border-white/70 rounded px-1 py-0.5"
          />
        ) : (
          <p className="min-w-0 truncate truncate select-none">{item.name}</p>
        )}
      </div>

      {isFolder && isExpanded
        ? item.children?.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              expandedFolderIds={expandedFolderIds}
              onToggleFolder={onToggleFolder}
              onExpandFolder={onExpandFolder}
              selectedId={selectedId}
              newItemName={newItemName}
              setNewItemName={setNewItemName}
              onUpdateNewItemName={onUpdateNewItemName}
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
