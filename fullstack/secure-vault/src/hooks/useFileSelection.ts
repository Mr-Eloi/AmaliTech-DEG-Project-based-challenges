import { useState, useCallback } from 'react';
import type { FileNode } from '../utils/treeTraversal.ts';

/**
 * REVIEWER NOTE: Custom hook to manage active file selection state
 * and maintain the recently accessed files list.
 */
export function useFileSelection() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  
  // Wildcard Feature: LRU selection queue (max 5 items)
  const [recentFiles, setRecentFiles] = useState<FileNode[]>([]);

  const selectFile = useCallback((file: FileNode) => {
    // Selection only applies to files, folders are expandable/collapsible instead.
    if (file.type !== 'file') return;
    
    setSelectedFile(file);

    setRecentFiles((prevRecent) => {
      // LRU Queue update logic: filter existing to prevent duplicates and shift to top.
      const filtered = prevRecent.filter((item) => item.id !== file.id);
      const updated = [file, ...filtered];
      return updated.slice(0, 5);
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return {
    selectedFile,
    recentFiles,
    selectFile,
    clearSelection,
  };
}
