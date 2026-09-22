"use client";

import { useWorkspaceContext } from "@/context/workspaceProvider";
import type { itemType } from "@/lib/types";
import { ChevronRight } from "lucide-react";

const Breadcrumb = () => {
  const { workspaceData, toggleFolder } = useWorkspaceContext();

  const targetId =
    workspaceData.openFileId ?? workspaceData.selectedFolderId ?? null;

  const path = getPathToItem(workspaceData.items, targetId);

  if (path.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-b-[var(--border)] px-2 py-1 text-xs">
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-wrap items-center gap-0.5"
      >
        {path.map((item, index) => {
          const isLast = index === path.length - 1;

          return (
            <span key={item.id} className="flex min-w-0 items-center gap-0.5">
              {index > 0 ? (
                <ChevronRight
                  className="size-3 shrink-0 text-[var(--text-muted)]"
                  aria-hidden
                />
              ) : null}
              {isLast ? (
                <span className="min-w-0 truncate">
                  {item.name}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleFolder(item.id, item.type === "folder")}
                  className="min-w-0 truncate rounded px-0.5 text-[var(--text-muted)] hover:underline"
                >
                  {item.name}
                </button>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
};

function getPathToItem(
  items: Record<string, itemType>,
  targetId: string | null,
): itemType[] {
  if (!targetId || !items[targetId]) {
    return [];
  }

  const path: itemType[] = [];
  let current: itemType | undefined = items[targetId];

  while (current) {
    path.unshift(current);
    current = current.parentId ? items[current.parentId] : undefined;
  }

  return path;
}

export default Breadcrumb;
