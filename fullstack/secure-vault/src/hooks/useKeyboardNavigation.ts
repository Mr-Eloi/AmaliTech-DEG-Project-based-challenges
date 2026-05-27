import { useState, useCallback } from 'react';
import type { FileNode } from '../utils/treeTraversal.ts';
import { getParentNodeId } from '../utils/treeTraversal.ts';

interface UseKeyboardNavigationProps {
  nodes: FileNode[];
  visibleNodes: FileNode[];
  expandedKeys: Set<string>;
  toggleFolder: (id: string, forceExpand?: boolean) => void;
  onSelectFile: (file: FileNode) => void;
}

/**
 * REVIEWER NOTE: Custom hook to manage keyboard focus states.
 * Translates standard keyboard codes (Arrows, Enter, Space) into tree-structural movements,
 * respecting folders' expanded/collapsed configurations.
 */
export function useKeyboardNavigation({
  nodes,
  visibleNodes,
  expandedKeys,
  toggleFolder,
  onSelectFile,
}: UseKeyboardNavigationProps) {
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const key = e.key;

      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(key)) {
        return;
      }

      // Prevent window viewport scrolling during arrow key interactions inside tree structure.
      e.preventDefault();

      if (visibleNodes.length === 0) return;

      const currentIndex = visibleNodes.findIndex((n) => n.id === focusedNodeId);

      switch (key) {
        // Move focus sequentially to the next visible node.
        case 'ArrowDown': {
          if (currentIndex === -1) {
            setFocusedNodeId(visibleNodes[0].id);
          } else if (currentIndex < visibleNodes.length - 1) {
            setFocusedNodeId(visibleNodes[currentIndex + 1].id);
          }
          break;
        }

        // Move focus sequentially to the previous visible node.
        case 'ArrowUp': {
          if (currentIndex === -1) {
            setFocusedNodeId(visibleNodes[visibleNodes.length - 1].id);
          } else if (currentIndex > 0) {
            setFocusedNodeId(visibleNodes[currentIndex - 1].id);
          }
          break;
        }

        // Folder logic: If collapsed, expand it. If already expanded, focus its first child.
        case 'ArrowRight': {
          if (currentIndex === -1) return;
          const currentNode = visibleNodes[currentIndex];
          if (currentNode.type === 'folder') {
            const isExpanded = expandedKeys.has(currentNode.id);
            if (!isExpanded) {
              toggleFolder(currentNode.id, true);
            } else if (currentNode.children && currentNode.children.length > 0) {
              setFocusedNodeId(currentNode.children[0].id);
            }
          }
          break;
        }

        // Folder/File logic: If expanded folder, collapse it. Otherwise, jump focus up to its parent folder.
        case 'ArrowLeft': {
          if (currentIndex === -1) return;
          const currentNode = visibleNodes[currentIndex];
          if (currentNode.type === 'folder' && expandedKeys.has(currentNode.id)) {
            toggleFolder(currentNode.id, false);
          } else {
            const parentId = getParentNodeId(nodes, currentNode.id);
            if (parentId) {
              setFocusedNodeId(parentId);
            }
          }
          break;
        }

        // Action trigger: Select files or toggle directory states.
        case 'Enter':
        case ' ': {
          if (currentIndex === -1) return;
          const currentNode = visibleNodes[currentIndex];
          if (currentNode.type === 'file') {
            onSelectFile(currentNode);
          } else if (currentNode.type === 'folder') {
            toggleFolder(currentNode.id);
          }
          break;
        }

        default:
          break;
      }
    },
    [nodes, visibleNodes, expandedKeys, focusedNodeId, toggleFolder, onSelectFile]
  );

  return {
    focusedNodeId,
    setFocusedNodeId,
    handleKeyDown,
  };
}
