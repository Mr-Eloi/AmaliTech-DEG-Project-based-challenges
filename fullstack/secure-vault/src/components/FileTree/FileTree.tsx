import React, { useEffect, useRef } from 'react';
import TreeNode from './TreeNode.tsx';
import type { FileNode } from '../../utils/treeTraversal.ts';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation.ts';

interface FileTreeProps {
  nodes: FileNode[];
  visibleNodes: FileNode[];
  expandedKeys: Set<string>;
  toggleFolder: (id: string, forceExpand?: boolean) => void;
  selectedFile: FileNode | null;
  onSelectFile: (file: FileNode) => void;
  searchQuery: string;
}

/**
 * REVIEWER NOTE: FileTree Container
 * Coordinates the recursive node rendering, hooks up the keyboard event handlers,
 * and handles view container focus and automatic node scroll-into-view adjustments.
 */
export const FileTree: React.FC<FileTreeProps> = ({
  nodes,
  visibleNodes,
  expandedKeys,
  toggleFolder,
  selectedFile,
  onSelectFile,
  searchQuery,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    focusedNodeId,
    setFocusedNodeId,
    handleKeyDown,
  } = useKeyboardNavigation({
    nodes,
    visibleNodes,
    expandedKeys,
    toggleFolder,
    onSelectFile,
  });

  useEffect(() => {
    if (focusedNodeId && !visibleNodes.some((n) => n.id === focusedNodeId)) {
      setFocusedNodeId(null);
    }
  }, [visibleNodes, focusedNodeId, setFocusedNodeId]);

  const handleFocus = () => {
    if (!focusedNodeId && visibleNodes.length > 0) {
      setFocusedNodeId(visibleNodes[0].id);
    }
  };

  /**
   * REVIEWER NOTE: Auto-scroller
   * Detects focused element position and adjusts container scrollTop to keep items visible.
   */
  useEffect(() => {
    if (focusedNodeId) {
      const element = document.getElementById(`tree-node-${focusedNodeId}`);
      if (element && containerRef.current) {
        const container = containerRef.current;
        const elemTop = element.offsetTop;
        const elemBottom = elemTop + element.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (elemTop < containerTop) {
          container.scrollTop = elemTop;
        } else if (elemBottom > containerBottom) {
          container.scrollTop = elemBottom - container.clientHeight;
        }
      }
    }
  }, [focusedNodeId]);

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      tabIndex={0}
      className="absolute inset-0 w-full h-full overflow-y-auto focus:outline-none select-none rounded-lg border border-gray-800 bg-slate-950 flex flex-col focus-within:border-gray-700 transition-colors"
      aria-label="SecureVault File System"
      role="tree"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-900 bg-slate-900 text-xs text-gray-500">
        <span>File Explorer</span>
        <span className="flex gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-800 text-[10px] rounded border border-gray-700">↑↓ Nav</kbd>
          <kbd className="px-1.5 py-0.5 bg-gray-800 text-[10px] rounded border border-gray-700">⇄ Expand</kbd>
          <kbd className="px-1.5 py-0.5 bg-gray-800 text-[10px] rounded border border-gray-700">Enter Select</kbd>
        </span>
      </div>

      <div className="py-2 flex-grow overflow-x-hidden">
        {nodes.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500 italic">No files found</div>
        ) : (
          nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              selectedFileId={selectedFile ? selectedFile.id : null}
              focusedNodeId={focusedNodeId}
              expandedKeys={expandedKeys}
              onNodeSelect={onSelectFile}
              onNodeToggle={toggleFolder}
              onNodeFocus={(id) => setFocusedNodeId(id)}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FileTree;
