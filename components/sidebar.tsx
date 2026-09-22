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
import { useEffect, useRef, useState } from "react";

type ContextMenuState = {
  item: itemType;
  x: number;
  y: number;
} | null;

const Sidebar = () => {
  const [newItemName, setNewItemName] = useState("");
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [renamingItemId, setRenamingItemId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const { workspaceData, toggleFolder, expandFolder, setWorkspaceData } =
    useWorkspaceContext();
  const itemArray = buildItemArray(workspaceData.items);

  const selectedId = workspaceData.selectedFolderId || workspaceData.openFileId;

  const resolveParentId = (selectedItemId: string | null): string | null => {
    if (!selectedItemId || !workspaceData.items[selectedItemId]) {
      return "workspace";
    }
    const selected = workspaceData.items[selectedItemId];
    return selected.type === "folder" ? selected.id : selected.parentId;
  };

  const handleAddNewItem = (
    selectedItemId: string | null,
    type: fileType,
    name: string,
  ) => {
    const parentId = resolveParentId(selectedItemId);
    if (!parentId || workspaceData.items[parentId]?.type !== "folder") {
      return;
    }

    setNewItemName(name);

    const newItem: itemType = {
      id: new Date().getTime().toString(),
      name,
      type,
      parentId,
      isNew: true,
      ...(type === "folder" ? { children: [] } : { content: "" }),
    };

    setWorkspaceData({
      ...workspaceData,
      items: {
        ...workspaceData.items,
        [newItem.id]: newItem,
      },
      expandedFolderIds: workspaceData.expandedFolderIds.includes(parentId)
        ? workspaceData.expandedFolderIds
        : [...workspaceData.expandedFolderIds, parentId],
    });
  };

  const handleFinalizeNewItem = (
    item: itemType,
    name: string,
  ): { ok: true } | { ok: false; error: string } => {
    if (!item.parentId) {
      return { ok: false, error: "Invalid folder." };
    }

    const siblings = getSiblingNames(
      workspaceData.items,
      item.parentId,
      item.id,
    );
    const validationError = validateItemName(name, siblings);
    if (validationError) {
      return { ok: false, error: validationError };
    }

    const trimmed = name.trim();
    const { isNew: _isNew, ...rest } = item;
    const finalized: itemType = { ...rest, name: trimmed };

    setWorkspaceData({
      ...workspaceData,
      items: {
        ...workspaceData.items,
        [item.id]: finalized,
      },
      ...(item.type === "file"
        ? { openFileId: item.id, selectedFolderId: null }
        : { selectedFolderId: item.id, openFileId: null }),
    });
    setNewItemName("");
    return { ok: true };
  };

  const handleCancelNewItem = (itemId: string) => {
    const { [itemId]: _removed, ...restItems } = workspaceData.items;
    setWorkspaceData({
      ...workspaceData,
      items: restItems,
    });
    setNewItemName("");
  };

  const handleFinalizeRename = (
    item: itemType,
    name: string,
  ): { ok: true } | { ok: false; error: string } => {
    if (!item.parentId) {
      return { ok: false, error: "Invalid folder." };
    }

    const siblings = getSiblingNames(
      workspaceData.items,
      item.parentId,
      item.id,
    );
    const validationError = validateItemName(name, siblings);
    if (validationError) {
      return { ok: false, error: validationError };
    }

    setWorkspaceData({
      ...workspaceData,
      items: {
        ...workspaceData.items,
        [item.id]: { ...item, name: name.trim() },
      },
    });
    setRenamingItemId(null);
    setRenameValue("");
    return { ok: true };
  };

  const handleDeleteItem = (itemId: string) => {
    const item = workspaceData.items[itemId];
    if (!item || item.parentId === null) {
      return;
    }

    const idsToDelete = new Set(
      collectDescendantIds(workspaceData.items, itemId),
    );
    const items = Object.fromEntries(
      Object.entries(workspaceData.items).filter(
        ([id]) => !idsToDelete.has(id),
      ),
    );

    let { selectedFolderId, openFileId, expandedFolderIds } = workspaceData;
    const fallbackParent = item.parentId ?? "workspace";

    if (openFileId && idsToDelete.has(openFileId)) {
      openFileId = null;
      selectedFolderId = fallbackParent;
    }
    if (selectedFolderId && idsToDelete.has(selectedFolderId)) {
      selectedFolderId = fallbackParent;
    }

    expandedFolderIds = expandedFolderIds.filter((id) => !idsToDelete.has(id));

    setWorkspaceData({
      ...workspaceData,
      items,
      selectedFolderId,
      openFileId,
      expandedFolderIds,
    });
  };

  useEffect(() => {
    if (!contextMenu) {
      return;
    }

    const closeMenu = () => setContextMenu(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    const timeoutId = window.setTimeout(() => {
      window.addEventListener("click", closeMenu);
    }, 0);

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [contextMenu]);

  return (
    <div className="group relative min-h-0 border-r border-r bg-[var(--bg-sidebar)] md:w-[260px] border-r-[var(--border)]">
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
            onFinalizeNewItem={handleFinalizeNewItem}
            onCancelNewItem={handleCancelNewItem}
            renamingItemId={renamingItemId}
            renameValue={renameValue}
            setRenameValue={setRenameValue}
            onFinalizeRename={handleFinalizeRename}
            onCancelRename={() => {
              setRenamingItemId(null);
              setRenameValue("");
            }}
            onContextMenuItem={(event, treeItem) => {
              if (treeItem.isNew) {
                return;
              }
              event.preventDefault();
              event.stopPropagation();
              setContextMenu({
                item: treeItem,
                x: event.clientX,
                y: event.clientY,
              });
            }}
          />
        ))}
      </div>
      {contextMenu ? (
        <div
          className="fixed z-50 min-w-[120px] rounded border border-[var(--border)] bg-[#252526] shadow-lg"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
          role="menu"
        >
          <ContextMenuButton
            label="Rename"
            onClick={() => {
              setRenamingItemId(contextMenu.item.id);
              setRenameValue(contextMenu.item.name);
              setContextMenu(null);
            }}
          />
          <ContextMenuButton
            label="Delete"
            disabled={contextMenu.item.parentId === null}
            onClick={() => {
              handleDeleteItem(contextMenu.item.id);
              setContextMenu(null);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

function ContextMenuButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className="block w-full px-3 py-1 text-left hover:bg-[var(--bg-activitybar)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}

const ActionArea = ({
  onAddNewItem,
  selectedId,
}: {
  onAddNewItem: (
    selectedId: string | null,
    type: fileType,
    name: string,
  ) => void;
  selectedId: string | null;
}) => {
  const { workspaceData, setWorkspaceData } = useWorkspaceContext();

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
    <div className="flex items-center justify-between w-full">
      <p className="min-w-0 flex-1 truncate text-xs text-[var(--text-muted)]">
        Explorer
      </p>
      <div className="hidden group-hover:flex items-center flex-1 justify-end">
        <ActionButton
          icon={<FilePlusCorner className="size-3.5" />}
          onClick={() => {
            onAddNewItem(selectedId, "file", "untitled.txt");
          }}
          title="New File"
        />
        <ActionButton
          icon={<FolderPlus className="size-3.5" />}
          onClick={() => {
            onAddNewItem(selectedId, "folder", "new folder");
          }}
          title="New Folder"
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
          onClick={() => {
            setWorkspaceData({
              ...workspaceData,
              expandedFolderIds: [],
            });
          }}
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
  onFinalizeNewItem,
  onCancelNewItem,
  renamingItemId,
  renameValue,
  setRenameValue,
  onFinalizeRename,
  onCancelRename,
  onContextMenuItem,
}: {
  item: itemType;
  depth: number;
  expandedFolderIds: string[];
  onToggleFolder: (id: string, isFolder: boolean) => void;
  onExpandFolder: (id: string) => void;
  selectedId: string | null;
  newItemName: string;
  setNewItemName: (name: string) => void;
  onFinalizeNewItem: (
    item: itemType,
    name: string,
  ) => { ok: true } | { ok: false; error: string };
  onCancelNewItem: (itemId: string) => void;
  renamingItemId: string | null;
  renameValue: string;
  setRenameValue: (name: string) => void;
  onFinalizeRename: (
    item: itemType,
    name: string,
  ) => { ok: true } | { ok: false; error: string };
  onCancelRename: () => void;
  onContextMenuItem: (event: React.MouseEvent, item: itemType) => void;
}) {
  const isFolder = item.type === "folder";
  const isExpanded = expandedFolderIds.includes(item.id);
  const isNew = Boolean(item.isNew);
  const isRenaming = renamingItemId === item.id;
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tryFinalize = (name: string) => {
    const result = onFinalizeNewItem(item, name);
    if (result.ok) {
      setError(null);
      return;
    }
    setError(result.error);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const tryFinalizeRename = (name: string) => {
    const result = onFinalizeRename(item, name);
    if (result.ok) {
      setError(null);
      return;
    }
    setError(result.error);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <>
      <div
        className={`flex min-w-0 cursor-pointer items-center gap-1 px-1 py-0.5 hover:bg-[var(--bg-workspace-header)] ${selectedId === item.id ? "bg-[var(--bg-activitybar)]" : ""}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => {
          if (isRenaming) {
            return;
          }
          onToggleFolder(item.id, isFolder);
        }}
        onContextMenu={(event) => onContextMenuItem(event, item)}
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
          <div
            className="min-w-0 flex-1 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              autoFocus
              value={newItemName}
              onChange={(e) => {
                setNewItemName(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  tryFinalize(newItemName);
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  onCancelNewItem(item.id);
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (!value.trim()) {
                  onCancelNewItem(item.id);
                  return;
                }
                tryFinalize(value);
              }}
              type="text"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `new-item-error-${item.id}` : undefined}
              className={`w-full rounded border px-1 py-0.5 outline-none ${
                error
                  ? "border-red-500"
                  : "border-white/70 focus:border-[var(--text-muted)]"
              }`}
            />
            {error ? (
              <p
                id={`new-item-error-${item.id}`}
                className="mt-0.5 text-[11px] leading-tight text-red-400 absolute top-full z-10 border border-red-500 rounded-md px-1 py-0.5 left-0 bg-[var(--bg-sidebar)]"
              >
                {error}
              </p>
            ) : null}
          </div>
        ) : isRenaming ? (
          <div
            className="min-w-0 flex-1 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              autoFocus
              value={renameValue}
              onChange={(e) => {
                setRenameValue(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  tryFinalizeRename(renameValue);
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  onCancelRename();
                  setError(null);
                }
              }}
              onBlur={(e) => {
                tryFinalizeRename(e.target.value);
              }}
              type="text"
              aria-invalid={error ? true : undefined}
              aria-describedby={
                error ? `rename-item-error-${item.id}` : undefined
              }
              className={`w-full rounded border px-1 py-0.5 outline-none ${
                error
                  ? "border-red-500"
                  : "border-white/70 focus:border-[var(--text-muted)]"
              }`}
            />
            {error ? (
              <p
                id={`rename-item-error-${item.id}`}
                className="mt-0.5 text-[11px] leading-tight text-red-400 absolute top-full z-10 border border-red-500 rounded-md px-1 py-0.5 left-0 bg-[var(--bg-sidebar)]"
              >
                {error}
              </p>
            ) : null}
          </div>
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
              onFinalizeNewItem={onFinalizeNewItem}
              onCancelNewItem={onCancelNewItem}
              renamingItemId={renamingItemId}
              renameValue={renameValue}
              setRenameValue={setRenameValue}
              onFinalizeRename={onFinalizeRename}
              onCancelRename={onCancelRename}
              onContextMenuItem={onContextMenuItem}
            />
          ))
        : null}
    </>
  );
}

function getSiblingNames(
  items: Record<string, itemType>,
  parentId: string,
  excludeItemId?: string,
): string[] {
  return Object.values(items)
    .filter((item) => item.parentId === parentId && item.id !== excludeItemId)
    .map((item) => item.name);
}

function validateItemName(name: string, siblingNames: string[]): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Name cannot be empty.";
  }
  const lower = trimmed.toLowerCase();
  if (siblingNames.some((sibling) => sibling.toLowerCase() === lower)) {
    return "An item with this name already exists in this folder.";
  }
  return null;
}

function collectDescendantIds(
  items: Record<string, itemType>,
  rootId: string,
): string[] {
  const ids = [rootId];
  for (const item of Object.values(items)) {
    if (item.parentId === rootId) {
      ids.push(...collectDescendantIds(items, item.id));
    }
  }
  return ids;
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
