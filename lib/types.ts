export type ItemType = "folder" | "file";

export type itemType = {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  content?: string; // for text files
};

export type localDataType = {
  items: Record<string, itemType>;
  selectedFolderId: string;
  openFileId: string | null;
  expandedFolderIds: string[];
};
