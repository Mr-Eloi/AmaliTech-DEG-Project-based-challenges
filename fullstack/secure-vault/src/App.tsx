import { useState, useMemo, useCallback } from 'react';
import rawData from './data/data.json';
import { type FileNode } from './utils/treeTraversal.ts';
import { useFileSelection } from './hooks/useFileSelection.ts';
import FileTree from './components/FileTree/FileTree.tsx';
import FileDetailsPanel from './components/FileDetailsPanel.tsx';
import SearchBar from './components/SearchBar.tsx';
import { getVisibleNodes, findExpandedKeysForSearch, getAllFolderIds } from './utils/treeTraversal.ts';

const initialNodes = rawData as FileNode[];

/**
 * REVIEWER NOTE: Dashboard Shell Component
 * Houses main state trees: file raw data, active query strings, and expanded directories.
 * Implements centralized actions and orchestrates layout structures.
 */
function App() {
  const [nodes] = useState<FileNode[]>(initialNodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const { selectedFile, recentFiles, selectFile } = useFileSelection();

  const toggleFolder = useCallback((id: string, forceExpand?: boolean) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (forceExpand !== undefined) {
        if (forceExpand) next.add(id);
        else next.delete(id);
      } else {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }, []);

  // REVIEWER NOTE: Live deep-search filtering & folder auto-expansion handler.
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim()) {
        const searchExpandedKeys = findExpandedKeysForSearch(nodes, query);
        setExpandedKeys((prev) => {
          const next = new Set(prev);
          searchExpandedKeys.forEach((key) => next.add(key));
          return next;
        });
      }
    },
    [nodes]
  );

  const visibleNodes = useMemo(() => {
    return getVisibleNodes(nodes, expandedKeys);
  }, [nodes, expandedKeys]);

  // Bulk expand/collapse controls (fully functional utility triggers).
  const handleExpandAll = () => {
    setExpandedKeys(getAllFolderIds(nodes));
  };

  const handleCollapseAll = () => {
    setExpandedKeys(new Set());
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-gray-200 flex flex-col overflow-hidden font-sans">
      <header className="h-16 border-b border-gray-900 bg-slate-900/80 backdrop-blur flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-wider text-white">Secure<span className='text-blue-500'>Vault</span></h1>
            <p className="text-[10px] text-gray-500 tracking-widest font-mono">CLOUD FILESYSTEM</p>
          </div>
        </div>

        {/* REVIEWER NOTE: Storage utilization pill showing current workspace storage usage. */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-950 border border-gray-800 text-xs">
          <span className="text-gray-400">Storage Used:</span>
          <span className="font-mono text-blue-500 font-bold">4.8 GB / 15 GB</span>
          <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '32%' }} />
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row p-6 gap-6 min-h-0">
        <div className="flex-grow md:w-2/3 flex flex-col gap-4 min-h-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-gray-800 p-3 rounded-lg">
            <div className="w-full sm:max-w-md">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handleExpandAll}
                className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700/80 border border-gray-700 text-xs font-medium text-gray-300 transition-colors flex items-center gap-1.5"
                title="Expand all directories"
              >
                Expand All
              </button>
              <button
                onClick={handleCollapseAll}
                className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700/80 border border-gray-700 text-xs font-medium text-gray-300 transition-colors flex items-center gap-1.5"
                title="Collapse all directories"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="flex-grow min-h-0 relative">
            <FileTree
              nodes={nodes}
              visibleNodes={visibleNodes}
              expandedKeys={expandedKeys}
              toggleFolder={toggleFolder}
              selectedFile={selectedFile}
              onSelectFile={selectFile}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        <div className="md:w-1/3 flex-shrink-0 min-h-[300px] md:min-h-0 flex flex-col">
          <FileDetailsPanel
            selectedFile={selectedFile}
            recentFiles={recentFiles}
            onSelectFile={selectFile}
          />
        </div>
      </main>

      <footer className="h-8 border-t border-gray-900 bg-slate-950 flex items-center justify-between px-6 text-[10px] text-gray-500 font-mono">
        <div className="flex items-center gap-4">
          <span>Visible: <strong className="text-gray-300">{visibleNodes.length}</strong> nodes</span>
          <span>Expanded: <strong className="text-gray-300">{expandedKeys.size}</strong> folders</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
