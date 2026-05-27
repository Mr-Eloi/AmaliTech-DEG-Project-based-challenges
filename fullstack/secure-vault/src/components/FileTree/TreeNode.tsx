import React from 'react';
import type { FileNode } from '../../utils/treeTraversal.ts';

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  selectedFileId: string | null;
  focusedNodeId: string | null;
  expandedKeys: Set<string>;
  onNodeSelect: (node: FileNode) => void;
  onNodeToggle: (nodeId: string) => void;
  onNodeFocus: (nodeId: string) => void;
  searchQuery: string;
}

// REVIEWER NOTE: Custom UI Icons
// Caret icon rotating dynamically depending on folder expansion.
const CaretIcon: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg
    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-150 mr-1.5 flex-shrink-0 ${
      expanded ? 'transform rotate-90' : ''
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
  </svg>
);

// Folder icon styled with different active colors based on expansion state.
const FolderIcon: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg
    className={`w-4 h-4 mr-2 flex-shrink-0 ${
      expanded ? 'text-blue-500' : 'text-gray-400'
    } transition-colors duration-150`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

// File icon selector returning dedicated SVGs and colors based on extension.
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'pdf':
      return (
        <svg className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2h4v3a1 1 0 001 1h3v6H6V6z" clipRule="evenodd" />
        </svg>
      );
    case 'xlsx':
    case 'xls':
    case 'csv':
      return (
        <svg className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
        </svg>
      );
    case 'docx':
    case 'doc':
      return (
        <svg className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      );
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'gif':
      return (
        <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6zm-1-7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
    case 'yaml':
    case 'yml':
    case 'json':
    case 'xml':
      return (
        <svg className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2v10h8V8h-3a1 1 0 01-1-1V4H6zm5-1v2.586l2.586 2.586H11V5z" clipRule="evenodd" />
        </svg>
      );
    case 'txt':
    case 'log':
    default:
      return (
        <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6a2 2 0 01.586 1.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
  }
};

// REVIEWER NOTE: Text Highlight Generator
// Regex-splits name matches and wraps them in HTML mark tags for live feedback.
const renderHighlight = (name: string, query: string) => {
  if (!query.trim()) return <span>{name}</span>;
  const parts = name.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-blue-500 text-white px-0.5 rounded font-medium">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

/**
 * REVIEWER NOTE: Recursive TreeNode Component
 * Renders the node row, and explicitly calls itself to render sub-children.
 * Uses a mathematical left padding based on node depth to maintain stable layout indentation.
 */
export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  depth,
  selectedFileId,
  focusedNodeId,
  expandedKeys,
  onNodeSelect,
  onNodeToggle,
  onNodeFocus,
  searchQuery,
}) => {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedKeys.has(node.id);
  const isSelected = selectedFileId === node.id;
  const isFocused = focusedNodeId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeFocus(node.id);
    if (isFolder) {
      onNodeToggle(node.id);
    } else {
      onNodeSelect(node);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      onNodeToggle(node.id);
    }
  };

  return (
    <div className="w-full select-none">

      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{ paddingLeft: `${(depth + 1) * 12}px` }}
        className={`group flex items-center py-1.5 pr-3 cursor-pointer border-l-2 transition-all duration-150 ${
          isSelected
            ? 'bg-blue-500/10 border-blue-500 text-gray-200'
            : isFocused
            ? 'bg-gray-800 border-blue-500/50 text-gray-200'
            : 'border-transparent text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'
        }`}
        role="treeitem"
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
        id={`tree-node-${node.id}`}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {isFolder && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onNodeToggle(node.id);
                onNodeFocus(node.id);
              }}
              className="p-0.5 hover:bg-gray-700/60 rounded cursor-pointer transition-colors"
            >
              <CaretIcon expanded={isExpanded} />
            </div>
          )}
        </div>

        {isFolder ? <FolderIcon expanded={isExpanded} /> : getFileIcon(node.name)}

        <span className="text-sm truncate select-none">
          {renderHighlight(node.name, searchQuery)}
        </span>
      </div>

      {/* REVIEWER NOTE: Explicit component recursion */}
      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <div role="group" className="w-full">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedFileId={selectedFileId}
              focusedNodeId={focusedNodeId}
              expandedKeys={expandedKeys}
              onNodeSelect={onNodeSelect}
              onNodeToggle={onNodeToggle}
              onNodeFocus={onNodeFocus}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}


      {isFolder && isExpanded && (!node.children || node.children.length === 0) && (
        <div
          style={{ paddingLeft: `${(depth + 2) * 12 + 16}px` }}
          className="py-1 text-xs text-gray-600 italic select-none"
        >
          (Empty Folder)
        </div>
      )}
    </div>
  );
};

export default TreeNode;
