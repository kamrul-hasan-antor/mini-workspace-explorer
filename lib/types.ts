export type fileType = "folder" | "file";

export type itemType = {
  id: string;
  name: string;
  type: fileType;
  parentId: string | null;
  content?: string; // for text files
  children?: itemType[]; // for folders
  isNew?: boolean; // for new items
};

export type localDataType = {
  items: Record<string, itemType>;
  selectedFolderId: string | null;
  openFileId: string | null;
  expandedFolderIds: string[];
};
