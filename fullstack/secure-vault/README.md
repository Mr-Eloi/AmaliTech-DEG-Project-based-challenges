# SecureVault File Explorer Dashboard

## Live Demo & Design Reference

### Production Deployment:
[Demo Link](https://secure-vault-tech.vercel.app/)

### Figma / Design Reference:
[Figma Link](https://www.figma.com/design/3AFpmU4lcJfEBSn4pYxgTJ/SecureVault?m=auto&t=WDlYuCrXN2MIeQ0S-1)

SecureVault is an enterprise-grade cloud security dashboard featuring a high-performance, accessible recursive file explorer UI. Designed for environments like law firms and banks where deeply nested, high-density file structures (2 to 20+ levels) are navigated daily, this dashboard delivers a fast, keyboard-first, and minimal dark-mode experience.

## Live Application Features
- **Fully Recursive Tree Render**: Visualizes folders and files down to infinite nesting levels without breaking the grid layout.
- **VS Code-Style Keyboard Accessibility**: Complete keyboard navigation through visible folders/files using arrows and selection keys.
- **Optimized Deep Search**: Filters items instantly and auto-expands parent directories of matches to reveal them.
- **Dynamic File Inspector**: Instantly presents file details (name, size, type, UUID path) upon selection.
- **Interactive Recently Accessed List (Wildcard)**: Tracks the last 5 files selected and allows quick jumping via sidebar shortcuts.

---

## Technical Architecture & Recursion Strategy

### How Recursion is Implemented

The file tree rendering relies on React components that explicitly call themselves to handle deep levels of nesting recursively:

1. **State Ownership**: The parent component, `App.tsx`, acts as the single source of truth, managing:
   - `nodes` (raw, unmodified file tree parsed from `data.json`).
   - `expandedKeys` (a `Set<string>` containing IDs of expanded folder nodes).
   - `selectedFile` (the active file metadata).

2. **Recursive Component (`TreeNode.tsx`)**:
   - `TreeNode` receives a single file system node and its current depth.
   - If the node is of `type: "folder"`, the folder checks if its ID is present in `expandedKeys`.
   - If the folder is expanded, `TreeNode` iterates over the folder's `children` and maps each child to a new `<TreeNode />` component instance.
   - For each level of depth, the node's offset is mathematically scaled using:
     ```tsx
     style={{ paddingLeft: `${(depth + 1) * 12}px` }}
     ```
     This keeps indentation clean, scalable, and responsive without relying on hardcoded Tailwind layouts.
   - In accordance with constraints, the tree data is **never flattened** for rendering, and stable, unique keys (`node.id`) are used to optimize React's reconciler.

---

## Keyboard Navigation Strategy

Mouse-free productivity is powered by a custom hook (`useKeyboardNavigation.ts`) that implements the following behavior:

- **Visibility-Aware Pre-Order Traversal**: Standard keyboard navigation must only traverse visible folders (skipping collapsed folders). To achieve this, the tree utilities compute a pre-order list of visible nodes:
  - If a node is a folder and expanded, search its children; otherwise, skip.
  - The index of the active focused node is tracked in this flattened array of visible nodes.
- **Key Mappings**:
  - `ArrowDown` / `ArrowUp`: Move focus to the next/previous visible node in the list.
  - `ArrowRight`: Expands the focused folder if collapsed. If already expanded, moves focus to its first child.
  - `ArrowLeft`: Collapses the focused folder if expanded. If already collapsed (or if focusing a file), jumps focus to the parent folder node.
  - `Enter` / `Space`: Selects the focused file (updating the inspection panel) or toggles the focused folder's expansion state.
- **Automatic Scrolling**: The tree container ref automatically monitors changes to the focused node ID and scrolls it into view if it moves off-screen.
- **Scroll Prevention**: Default browser arrow-scrolling is intercepted inside the file tree to keep the viewport stable.

---

## Wildcard Feature: Recently Accessed Files

To elevate the UX for power users, **Option A: Recently Accessed Files** was implemented.

### Why this improves UX
In large file systems, professionals often jump back and forth between the same set of files (e.g., comparing contracts, checking log timestamps). Searching for the file again or digging through nested trees wastes time.
The **Recently Accessed** panel solves this:
- Acts as a dynamic "most recently used" (MRU) list at the bottom of the inspection panel.
- Tracks up to 5 recently selected files.
- Automatically handles duplicates: if an already-recent file is selected again, it moves back to the top of the stack.
- Elements in the list are fully interactive. Clicking a file in the recent files panel instantly selects the file, focuses the node, and reveals details.

---

## Design System (Dark Mode Only)

The design system translates a "cyber-secure, enterprise-grade, fast, minimal" brand into CSS:

- **Color Palette**:
  - **Background**: Deep Space Obsidian
  - **Panel**: Midnight Steel
  - **Accent**: Neon Cobalt Blue
  - **Text**: Slate Gray Ice
  - **Muted**: Dark Muted Gray
- **Visual Cues**:
  - Caret indicators rotate 90° smoothly when folders expand.
  - Custom file type icons visually categorize files (`.pdf` is red, spreadsheets are green, documents are blue, images are purple, configurations are yellow).
  - Selected nodes show a neon blue left border accent. Keyboard-focused nodes display a subtle focus border.
  - Active search highlights matching sub-characters inside file names to improve visual scannability.

---

## Setup & Installation Instructions

To run the SecureVault dashboard locally, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone or download the repository.
2. Navigate to the project directory:
   ```bash
   cd fullstack/secure-vault
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Build the application for production:
   ```bash
   npm run build
   ```
6. Run the production preview:
   ```bash
   npm run preview
   ```
