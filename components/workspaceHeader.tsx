import { useWorkspaceContext } from "@/context/workspaceProvider";
import { File, X } from "lucide-react";

export const WorkspaceHeader = ({
  fileName,
  folderName,
  isDraft,
}: {
  fileName: string | null;
  folderName: string | null;
  isDraft: boolean;
}) => {
  const { closeOpenFile } = useWorkspaceContext();

  return (
    <div className="flex h-8 shrink-0 items-center overflow-x-auto border-b border-b-[var(--border)] bg-[var(--bg-workspace-header)]">
      {fileName ? (
        <div className="flex h-full max-w-full items-center gap-2 border-r border-r-[var(--border)] bg-[#1e1e1e] px-2">
          <div className="flex min-w-0 items-center gap-1">
            <File className="size-4 shrink-0" />
            <p className="max-w-[40vw] truncate text-[var(--text-muted)] sm:max-w-none">
              {fileName}
            </p>
            {isDraft && <div className="size-1.25 bg-[#777] rounded-full" />}
          </div>
          <button
            type="button"
            onClick={closeOpenFile}
            className="hover:bg-[var(--bg-header)] rounded cursor-pointer p-0.5"
            aria-label="Close file"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <p className="min-w-0 truncate px-3 text-[var(--text-muted)] sm:px-4">
          {folderName ? folderName : "Untitled - Mini Workspace Explorer"}
        </p>
      )}
    </div>
  );
};
