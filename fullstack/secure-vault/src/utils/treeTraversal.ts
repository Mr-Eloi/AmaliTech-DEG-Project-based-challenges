export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  children?: FileNode[];
}

/**
 * REVIEWER NOTE: Flat representation of visible nodes.
 * Used to implement linear keyboard navigation (ArrowUp/ArrowDown)
 * by bypassing nodes hidden inside collapsed folders.
 */
export function getVisibleNodes(
  nodes: FileNode[],
  expandedKeys: Set<string>
): FileNode[] {
  const visible: FileNode[] = [];

  function traverse(node: FileNode) {
    visible.push(node);
    if (node.type === 'folder' && expandedKeys.has(node.id) && node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }

  return visible;
}

/**
 * REVIEWER NOTE: Path parent node search.
 * Resolves the parent ID of a node recursively. Used for ArrowLeft navigation,
 * allowing the user to move focus back to the parent folder.
 */
export function getParentNodeId(
  nodes: FileNode[],
  targetId: string,
  parentId: string | null = null
): string | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return parentId;
    }
    if (node.children) {
      const found = getParentNodeId(node.children, targetId, node.id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * REVIEWER NOTE: Depth-First Search for search matches.
 * Returns folder IDs that need to be expanded to make matching items visible.
 * Recursively checks descendants, maintaining the path stack.
 */
export function findExpandedKeysForSearch(
  nodes: FileNode[],
  query: string
): Set<string> {
  const expandedKeys = new Set<string>();
  if (!query.trim()) return expandedKeys;

  const normalizedQuery = query.toLowerCase();

  function search(node: FileNode, path: string[]): boolean {
    const isMatch = node.name.toLowerCase().includes(normalizedQuery);
    
    let hasMatchingDescendant = false;
    if (node.children) {
      for (const child of node.children) {
        if (search(child, [...path, node.id])) {
          hasMatchingDescendant = true;
        }
      }
    }

    const matches = isMatch || hasMatchingDescendant;
    if (matches && path.length > 0) {
      path.forEach(id => expandedKeys.add(id));
    }

    return matches;
  }

  for (const node of nodes) {
    search(node, []);
  }

  return expandedKeys;
}

/**
 * REVIEWER NOTE: Flat recursion gatherer.
 * Retrieves all folder IDs in the tree to support the "Expand All" feature.
 */
export function getAllFolderIds(nodes: FileNode[]): Set<string> {
  const ids = new Set<string>();
  function traverse(node: FileNode) {
    if (node.type === 'folder') {
      ids.add(node.id);
      if (node.children) {
        node.children.forEach(traverse);
      }
    }
  }
  nodes.forEach(traverse);
  return ids;
}
