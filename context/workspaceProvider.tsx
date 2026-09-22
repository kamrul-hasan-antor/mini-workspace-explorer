"use client";

import { createContext, useContext } from "react";

type workspaceContextValue = {
  a: number;
  //   workspaceData: localDataType;
  //   setWorkspaceData: (workspaceData: localDataType) => void;
};

const WorkspaceContext = createContext<workspaceContextValue | null>(null);

export default function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceContext.Provider value={{ a: 1 }}>
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
