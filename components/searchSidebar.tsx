"use client";

import { useWorkspaceContext } from "@/context/workspaceProvider";
import type { itemType } from "@/lib/types";
import { File, Folder, Search } from "lucide-react";
import { useMemo, useState } from "react";

function getPathToItem(
  items: Record<string, itemType>,
  targetId: string,
): itemType[] {
  const path: itemType[] = [];
  let current: itemType | undefined = items[targetId];

  while (current) {
    path.unshift(current);
    current = current.parentId ? items[current.parentId] : undefined;
  }

  return path;
}

function formatItemPath(
  items: Record<string, itemType>,
  item: itemType,
): string {
  const path = getPathToItem(items, item.id);
  if (path.length <= 1) {
    return path[0]?.name ?? "";
  }
  return path
    .slice(0, -1)
    .map((segment) => segment.name)
    .join(" › ");
}

const SearchSidebar = ({
  query,
  setQuery,
  onNavigate,
}: {
  query: string;
  setQuery: (query: string) => void;
  onNavigate?: () => void;
}) => {
  const { workspaceData, setWorkspaceData } = useWorkspaceContext();

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }

    return Object.values(workspaceData.items)
      .filter((item) => !item.isNew)
      .filter((item) => {
        if (item.name.toLowerCase().includes(trimmed)) {
          return true;
        }
        if (
          item.type === "file" &&
          item.content?.toLowerCase().includes(trimmed)
        ) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });
  }, [query, workspaceData.items]);

  const selectedId = workspaceData.selectedFolderId || workspaceData.openFileId;

  const openResult = (item: itemType) => {
    const path = getPathToItem(workspaceData.items, item.id);
    const folderIds = path
      .filter((segment) => segment.type === "folder")
      .map((segment) => segment.id);

    setWorkspaceData({
      ...workspaceData,
      expandedFolderIds: [
        ...new Set([...workspaceData.expandedFolderIds, ...folderIds]),
      ],
      selectedFolderId: item.type === "folder" ? item.id : null,
      openFileId: item.type === "file" ? item.id : null,
    });
    onNavigate?.();
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-[var(--bg-sidebar)] md:w-[260px] md:shrink-0">
      <div className="flex h-8 items-center border-b border-b-[var(--border)] px-3">
        <p className="min-w-0 flex-1 truncate text-xs text-[var(--text-muted)]">
          Search
        </p>
      </div>
      <div className="border-b border-b-[var(--border)] p-2">
        <div className="flex items-center gap-2 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1">
          <Search className="size-3.5 shrink-0 text-[var(--text-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files and folders"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
            aria-label="Search workspace"
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto py-1">
        {!query.trim() ? (
          <p className="px-3 py-2 text-xs text-[var(--text-muted)]">
            Type to search by name or file content.
          </p>
        ) : results.length === 0 ? (
          <p className="px-3 py-2 text-xs text-[var(--text-muted)]">
            No results found.
          </p>
        ) : (
          results.map((item) => {
            const isFolder = item.type === "folder";
            const parentPath = formatItemPath(workspaceData.items, item);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openResult(item)}
                className={`flex w-full min-w-0 cursor-pointer items-start gap-2 px-2 py-1 text-left hover:bg-[var(--bg-workspace-header)] ${
                  selectedId === item.id ? "bg-[var(--bg-activitybar)]" : ""
                }`}
              >
                {isFolder ? (
                  <Folder className="mt-0.5 size-3.5 shrink-0 fill-[#dcb67a] stroke-[#dcb67a]" />
                ) : (
                  <File className="mt-0.5 size-4 shrink-0" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate select-none">
                    {item.name}
                  </span>
                  {parentPath ? (
                    <span className="block truncate text-[11px] text-[var(--text-muted)]">
                      {parentPath}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchSidebar;
