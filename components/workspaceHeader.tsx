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
    <div className="flex items-center h-8 border-b border-b-[var(--border)] bg-[var(--bg-workspace-header)]">
      {fileName ? (
        <div className="flex items-center px-2 h-full border-r border-r-[var(--border)] bg-[#1e1e1e] gap-2">
          <div className="flex items-center gap-1">
            <File className="size-4" />
            <p className="text-[var(--text-muted)]">{fileName}</p>
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
        <p className="text-[var(--text-muted)] px-4">
          {folderName ? folderName : "Untitled - Mini Workspace Explorer"}
        </p>
      )}
    </div>
  );
};
