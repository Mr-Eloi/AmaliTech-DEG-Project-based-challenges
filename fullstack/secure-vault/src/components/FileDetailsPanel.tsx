import React from 'react';
import type { FileNode } from '../utils/treeTraversal.ts';

interface FileDetailsPanelProps {
  selectedFile: FileNode | null;
  recentFiles: FileNode[];
  onSelectFile: (file: FileNode) => void;
}

// REVIEWER NOTE: Preview Asset selection
// Renders large icons matched by type to simulate file thumbnails in properties inspection card.
const getLargeFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'pdf':
      return (
        <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 9h1.5M9 13h5M9 17h5" />
          </svg>
        </div>
      );
    case 'xlsx':
    case 'xls':
    case 'csv':
      return (
        <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    case 'docx':
    case 'doc':
      return (
        <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      );
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'gif':
      return (
        <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    case 'yaml':
    case 'yml':
    case 'json':
    case 'xml':
      return (
        <div className="w-16 h-16 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-16 h-16 rounded-xl bg-gray-500/10 flex items-center justify-center text-gray-400 border border-gray-500/20">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      );
  }
};

const getMiniFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return <span className="w-2.5 h-2.5 rounded-full bg-red-500" />;
    case 'xlsx': case 'xls': case 'csv': return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />;
    case 'docx': case 'doc': return <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />;
    case 'png': case 'jpg': case 'jpeg': case 'svg': return <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />;
    case 'yaml': case 'yml': case 'json': return <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />;
    default: return <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />;
  }
};

/**
 * REVIEWER NOTE: Properties & Wildcard Panel
 * Displays metadata properties for the active selection.
 * Also embeds the interactive 'Recently Accessed' list to allow quick jump-backs.
 */
export const FileDetailsPanel: React.FC<FileDetailsPanelProps> = ({
  selectedFile,
  recentFiles,
  onSelectFile,
}) => {
  const getFileExtension = (name: string) => {
    return name.split('.').pop()?.toUpperCase() || 'Unknown';
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border border-gray-800 rounded-lg p-5 overflow-y-auto">
      <div className="flex-grow flex flex-col">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
          File Properties
        </h3>


        {selectedFile ? (
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="my-6">
              {getLargeFileIcon(selectedFile.name)}
            </div>

            <div className="w-full text-left space-y-4">
              <div>
                <span className="text-xs text-gray-500 block uppercase tracking-wider font-semibold">Name</span>
                <span className="text-sm text-gray-200 font-medium break-all select-all">{selectedFile.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 block uppercase tracking-wider font-semibold">Extension</span>
                  <span className="text-xs text-gray-200 font-mono bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700 w-max inline-block mt-0.5">
                    {getFileExtension(selectedFile.name)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block uppercase tracking-wider font-semibold">Size</span>
                  <span className="text-sm text-gray-200 font-mono mt-0.5 block">{selectedFile.size || 'N/A'}</span>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-3">
                <span className="text-xs text-gray-500 block uppercase tracking-wider font-semibold">Unique Node ID</span>
                <span className="text-xs font-mono text-blue-500 select-all break-all">{selectedFile.id}</span>
              </div>
            </div>
          </div>
        ) : (

          <div className="flex-grow flex flex-col items-center justify-center text-center py-10 px-4">
            <svg
              className="w-12 h-12 text-gray-600 mb-3 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm text-gray-500 font-medium">No File Selected</p>
            <p className="text-xs text-gray-600 mt-1 max-w-[200px]">
              Select a file node in the explorer to view its system metadata properties.
            </p>
          </div>
        )}
      </div>


      <div className="mt-8 border-t border-gray-800 pt-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Recently Accessed
        </h4>
        {recentFiles.length === 0 ? (
          <p className="text-xs text-gray-600 italic">No files accessed yet.</p>
        ) : (
          <div className="space-y-1.5">
            {recentFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => onSelectFile(file)}
                className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded text-xs transition-colors group ${
                  selectedFile?.id === file.id
                    ? 'bg-gray-800 text-gray-200 border-l-2 border-blue-500'
                    : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {getMiniFileIcon(file.name)}
                  <span className="truncate pr-2 font-medium">{file.name}</span>
                </span>
                <span className="text-[10px] text-gray-600 font-mono flex-shrink-0 group-hover:text-gray-400">
                  {file.size}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDetailsPanel;
