import { useWorkspaceContext } from "@/context/workspaceProvider";
import { WorkspaceHeader } from "./workspaceHeader";
import { File, Folder } from "lucide-react";

const WorkspaceView = () => {
  const { workspaceData } = useWorkspaceContext();

  const selectedId =
    workspaceData.selectedFolderId || workspaceData.openFileId || null;

  const itemArr = workspaceData.items ? Object.values(workspaceData.items) : [];

  const selectedItemArr = itemArr.filter((item) => {
    const id = item.type === "file" ? item.id : item.parentId;

    return item.parentId === selectedId;
  });

  console.log(selectedId, selectedItemArr);
  return (
    <div>
      <WorkspaceHeader />
      <div className="p-2">
        {selectedItemArr.length > 0 ? (
          selectedItemArr.map((item) => {
            const isFolder = item.type === "folder";
            return (
              <div key={item.id}>
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
