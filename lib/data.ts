import { itemType } from "./types";

const STORAGE_KEY = "mini-workspace-data";

export { STORAGE_KEY };

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
    "readme-md": {
      id: "readme-md",
      name: "README.md",
      type: "file",
      parentId: "workspace",
      content: `# Mini Workspace Explorer

A VS Code–inspired file explorer built with Next.js. Browse a virtual workspace tree, create and rename folders and text files, search by name or content, edit files in the main pane, and persist everything in the browser via \`localStorage\`.

**Live demo:** [https://mini-workspace-henna.vercel.app/](https://mini-workspace-henna.vercel.app/)

## How to run

**Requirements:** Node.js 20+ and npm.

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) locally, or try the [live deployment](https://mini-workspace-henna.vercel.app/).

| Script        | Description              |
| ------------- | ------------------------ |
| \`npm run dev\` | Development server       |
| \`npm run build\` | Production build       |
| \`npm start\`   | Serve production build   |
| \`npm run lint\` | Run ESLint              |

## Project structure

\`\`\`
mini-workspace/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, fonts, global metadata
│   ├── page.tsx            # Home page (renders <Home />)
│   └── globals.css         # Theme CSS variables (dark VS Code–like palette)
├── components/
│   ├── home.tsx            # Shell: provider, header, activity bar, sidebars, main view
│   ├── activitybar.tsx     # Explorer / Search panel switcher
│   ├── sidebar.tsx         # File tree, CRUD, context menu, toolbar actions
│   ├── searchSidebar.tsx   # Search by file/folder name or file content
│   ├── workspaceView.tsx   # Folder listing or file editor
│   ├── workspaceHeader.tsx # Open file tab with draft indicator and close
│   ├── breadcrumb.tsx      # Path navigation for selection / open file
│   └── header.tsx          # Top bar and mobile sidebar toggle
├── context/
│   └── workspaceProvider.tsx  # Workspace state, persistence, shared actions
└── lib/
    ├── data.ts             # Inital Data
    └── types.ts            # \`itemType\`, \`localDataType\`, etc.
\`\`\`

## State management

Workspace data lives in a **React Context** (\`WorkspaceProvider\`) with a \`useWorkspaceContext()\` hook.

- **Initial load:** On the client, state is read from \`localStorage\` (key \`mini-workspace-data\`). If missing or invalid JSON, the app seeds defaults from \`createItems()\` in \`lib/data.ts\` and writes them back.
- **Updates:** \`setWorkspaceData\` updates React state and synchronously persists the full \`localDataType\` object to \`localStorage\`.
- **Loading gate:** The provider shows a loading UI until hydration from storage completes, avoiding SSR/client mismatches on the tree.
- **Local UI state:** Panel choice (Explorer vs Search), search query, mobile sidebar open/closed, inline rename/create inputs, and unsaved editor text are kept in component state where they do not need to be persisted.

Context exposes helpers: \`toggleFolder\`, \`expandFolder\`, \`saveFile\`, and \`closeOpenFile\`.

## File-system data structure

The virtual filesystem is a **flat map** of items keyed by \`id\`, not a deeply nested JSON tree on disk.

### \`itemType\`

| Field       | Description                                      |
| ----------- | ------------------------------------------------ |
| \`id\`        | Unique string (timestamp for user-created items) |
| \`name\`      | Display name                                     |
| \`type\`      | \`"folder"\` or \`"file"\`                           |
| \`parentId\`  | Parent folder id, or \`null\` for the root         |
| \`content\`   | Text body (files only)                           |
| \`isNew\`     | Inline create in progress (stripped on finalize) |

The optional \`children\` array on \`itemType\` is **derived at render time** in \`buildItemArray()\` inside \`sidebar.tsx\`; persisted data only uses \`parentId\` links.

### \`localDataType\` (persisted blob)

\`\`\`ts
{
  items: Record<string, itemType>;
  selectedFolderId: string | null;   // folder shown in main pane when no file is open
  openFileId: string | null;         // file open in the editor
  expandedFolderIds: string[];       // which folders are expanded in the tree
}
\`\`\`

Parent/child relationships are resolved by matching each item’s \`parentId\` to another item’s \`id\`. Deleting a folder recursively removes that item and all descendants from \`items\` and cleans selection/expansion state.

## Important implementation decisions

1. **Flat map + adjacency list** — Storing \`Record<string, itemType>\` with \`parentId\` keeps updates (rename, move parent context, delete subtree) simple and matches how the tree is rebuilt for the UI. Sibling ordering follows object insertion order from the map.

2. **Single source of truth in context** — Explorer, search, breadcrumbs, and the editor all read/write the same \`workspaceData\`; search results expand folders along the path to the chosen item and set \`openFileId\` / \`selectedFolderId\` accordingly.

3. **Editor draft vs persisted content** — The textarea keeps local \`fileContent\` and an \`isDraft\` flag; saving runs on **Ctrl/Cmd+S** via \`saveFile\`, which updates \`items[id].content\` and \`localStorage\`. Unsaved changes are indicated in the workspace header.

4. **Create/rename UX** — New items are added with \`isNew: true\` and inline validation (non-empty name, no duplicate sibling names case-insensitively). Empty name on blur cancels creation; Escape cancels create/rename.

5. **No backend** — Entirely client-side; reset in the Explorer toolbar restores the seed data from \`createItems()\` and default expansion (\`workspace\`, \`projects\`, \`webbly\`).

6. **VS Code–like layout** — Activity bar, explorer/search sidebars, dark theme via CSS variables in \`globals.css\`, [Lucide](https://lucide.dev) icons. On small screens the sidebar is a slide-over drawer with an overlay; choosing a tree/search item closes it on viewports under 768px.

7. **Next.js App Router** — Interactive pieces are \`"use client"\` components; the root page stays a thin server entry that renders \`Home\`.
`,
    },
  };

  return items;
}
