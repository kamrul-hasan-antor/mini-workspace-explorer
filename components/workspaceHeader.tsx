import { Dot, File, X } from "lucide-react";

export const WorkspaceHeader = () => {
  return (
    <div className="flex items-center h-8 border-b border-b-[var(--border)] bg-[var(--bg-workspace-header)]">
      {/* <p className="text-[var(--text-muted)] px-4">
        Untitled - Mini Workspace Explorer
      </p> */}

      <div className="flex items-center px-2 h-full border-r border-r-[var(--border)] bg-[#1e1e1e] gap-2">
        <div className="flex items-center gap-1">
          <File className="size-4" />
          <p className="text-[var(--text-muted)]">file.txt</p>
          <div className="size-1.5 bg-[#777] rounded-full" />
        </div>
        <button className="hover:bg-[var(--bg-header)] rounded cursor-pointer p-0.5">
          <X className="size-3" />
        </button>
      </div>
    </div>
  );
};
