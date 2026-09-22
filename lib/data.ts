import { itemType } from "./types";

export function createItems(): Record<string, itemType> {
  const items: Record<string, itemType> = {
    workspace: {
      id: "workspace",
      name: "Workspace",
      type: "folder",
      parentId: null,
    },
    projects: {
      id: "projects",
      name: "Projects",
      type: "folder",
      parentId: "workspace",
    },
    webbly: {
      id: "webbly",
      name: "Webbly",
      type: "folder",
      parentId: "projects",
    },
    "notes-txt": {
      id: "notes-txt",
      name: "notes.txt",
      type: "file",
      parentId: "webbly",
      content: "Meeting notes for the Webbly Media frontend assessment.\n",
    },
    "tasks-txt": {
      id: "tasks-txt",
      name: "tasks.txt",
      type: "file",
      parentId: "webbly",
      content:
        "- Build tree view\n- Add create / rename / delete\n- Persist to localStorage\n",
    },
    personal: {
      id: "personal",
      name: "Personal",
      type: "folder",
      parentId: "projects",
    },
    documents: {
      id: "documents",
      name: "Documents",
      type: "folder",
      parentId: "workspace",
    },
    "readme-txt": {
      id: "readme-txt",
      name: "README.txt",
      type: "file",
      parentId: "documents",
      content:
        "Welcome to Mini Workspace Explorer.\n\nCreate folders and text files, search the tree, and edit content.\n",
    },
  };

  return items;
}
