"use client";

import { STORAGE_KEY, createItems } from "@/lib/data";
import type { localDataType } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type WorkspaceContextValue = {
  workspaceData: localDataType;
  setWorkspaceData: (workspaceData: localDataType) => void;
  isLoading: boolean;
  toggleFolder: (id: string, isFolder: boolean) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function readWorkspaceFromStorage(): localDataType {
  const initial = {
    items: createItems(),
    selectedFolderId: "workspace",
    openFileId: null,
    expandedFolderIds: ["workspace", "projects", "webbly"],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed: localDataType = JSON.parse(raw);

    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

export default function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workspaceData, setWorkspaceDataState] = useState<localDataType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = readWorkspaceFromStorage();
    setWorkspaceDataState(data);
    setIsLoading(false);
  }, []);

  const setWorkspaceData = useCallback((data: localDataType) => {
    setWorkspaceDataState(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const toggleFolder = useCallback(
    (id: string, isFolder: boolean) => {
      if (!workspaceData) return;
      const { expandedFolderIds } = workspaceData;
      setWorkspaceData({
        ...workspaceData,
        expandedFolderIds: expandedFolderIds.includes(id)
          ? expandedFolderIds.filter((folderId) => folderId !== id)
          : [...expandedFolderIds, id],
        selectedFolderId: isFolder ? id : null,
        openFileId: isFolder ? null : id,
      });
    },
    [workspaceData],
  );

  if (isLoading || !workspaceData) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-muted)]">
        Loading workspace…
      </div>
    );
  }

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceData,
        setWorkspaceData,
        isLoading: false,
        toggleFolder,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("Workspace context not found");
  }
  return context;
}
