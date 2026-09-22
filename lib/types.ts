export type ItemType = "folder" | "file";

export type itemType = {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  content?: string; // for text files
  children?: itemType[]; // for folders
};

export type localDataType = {
  items: Record<string, itemType>;
  selectedFolderId: string | null;
  openFileId: string | null;
  expandedFolderIds: string[];
};
