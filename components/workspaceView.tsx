"use client";

import { useWorkspaceContext } from "@/context/workspaceProvider";
import { WorkspaceHeader } from "./workspaceHeader";
import { File, Folder } from "lucide-react";
import { useEffect, useState } from "react";

const WorkspaceView = () => {
  const { workspaceData, toggleFolder, saveFile } = useWorkspaceContext();

  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState<boolean>(false);

  const itemArr = workspaceData.items ? Object.values(workspaceData.items) : [];

  const openFile = workspaceData.openFileId
    ? workspaceData.items[workspaceData.openFileId]
    : null;

  const folderChildren =
    workspaceData.selectedFolderId && !openFile
      ? itemArr.filter(
          (item) => item.parentId === workspaceData.selectedFolderId,
        )
      : [];

  useEffect(() => {
    if (workspaceData.openFileId) {
      setFileContent(
        workspaceData.items[workspaceData.openFileId]?.content ?? null,
      );
    }
  }, [workspaceData.openFileId]);

  return (
    <div>
      <WorkspaceHeader
        fileName={openFile ? openFile.name : null}
        folderName={
          workspaceData.items[workspaceData?.selectedFolderId ?? ""]?.name ??
          null
        }
        isDraft={isDraft}
      />
      <div className="p-2">
        {openFile ? (
          <div className="flex min-h-[460px] flex-col">
            <textarea
              value={fileContent ?? ""}
              onChange={(e) => {
                setFileContent(e.target.value);

                if (e.target.value !== openFile.content) {
                  setIsDraft(true);
                } else if (isDraft) setIsDraft(false);
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                  e.preventDefault();
                  if (e.currentTarget.value !== openFile.content) {
                    saveFile(workspaceData.openFileId!, e.currentTarget.value);
                  }
                }
              }}
              spellCheck={false}
              className="min-h-0 flex-1 resize-none bg-[var(--vscode-editor)] p-2 leading-6 text-[#d4d4d4] outline-none"
            />
          </div>
        ) : folderChildren.length > 0 ? (
          folderChildren.map((item) => {
            const isFolder = item.type === "folder";
            return (
              <div
                key={item.id}
                onClick={() => toggleFolder(item.id, isFolder)}
              >
                <div
                  className={`flex min-w-0 cursor-pointer items-center gap-1 rounded px-3 py-1 hover:bg-[var(--bg-activitybar)]`}
                >
                  {isFolder ? (
                    <Folder className="size-3.5 shrink-0 fill-[#dcb67a] stroke-[#dcb67a]" />
                  ) : (
                    <File className="size-4 shrink-0" />
                  )}

                  <p className="min-w-0 truncate truncate select-none">
                    {item.name}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full min-h-[460px] flex-col items-center justify-center text-center">
            <p className="text-[13px] text-[var(--text-muted)]">
              This folder is empty
            </p>
            <p className="mt-1 text-[12px] text-[var(--text-muted)]">
              Use the Explorer toolbar to create a file or folder
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceView;
