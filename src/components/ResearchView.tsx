import { useState } from 'react';
import { DatabricksFileBrowser } from './DatabricksFileBrowser';
import { Database, X, Download as DownloadIcon } from 'lucide-react';
import { downloadKnowledgeBaseFile } from '../utils/databricksAPI';

interface ResearchFile {
  id: string;
  brand: string;
  projectType: string;
  fileName: string;
  isApproved: boolean;
  uploadDate: number;
  fileType: string;
  content?: string;
  source?: string;
  contentSummary?: string;
}

interface EditSuggestion {
  id: string;
  researchFileId: string;
  fileName: string;
  suggestedBy: string;
  suggestion: string;
  timestamp: number;
  status: 'pending' | 'reviewed' | 'implemented';
}

interface ResearchViewProps {
  role: 'researcher' | 'non-researcher';
  brand: string;
  projectType: string;
  researchFiles: ResearchFile[];
  editSuggestions: EditSuggestion[];
  onAddSuggestion: (fileId: string, suggestion: string) => void;
  onUpdateSuggestionStatus: (suggestionId: string, status: 'pending' | 'reviewed' | 'implemented') => void;
  onToggleApproval: (fileId: string) => void;
  canApproveResearch: boolean;
  onCreateResearchFile: (file: Omit<ResearchFile, 'id' | 'uploadDate'>) => void;
}

export function ResearchView({
  role,
  brand,
  projectType,
  researchFiles,
  editSuggestions,
  onAddSuggestion,
  onUpdateSuggestionStatus,
  onToggleApproval,
  canApproveResearch,
  onCreateResearchFile,
}: ResearchViewProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [newSuggestion, setNewSuggestion] = useState('');
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [showDatabricksBrowser, setShowDatabricksBrowser] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Filter state — default to current brand, all project types, all statuses
  const [filterBrand, setFilterBrand] = useState(brand);
  const [filterProjectType, setFilterProjectType] = useState('');
  const [filterApproved, setFilterApproved] = useState<'all' | 'approved' | 'unapproved'>('all');

  // Derive unique values for dropdowns from the full file list
  const allBrands = Array.from(new Set(researchFiles.map(f => f.brand).filter(Boolean))).sort();
  const allProjectTypes = Array.from(new Set(researchFiles.map(f => f.projectType).filter(Boolean))).sort();

  // Files matching the active filters.
  // Files with no brand (general/category scope) are always included when a brand filter is set —
  // they appear in the Enter hex for any brand so they should be visible here too.
  const displayFiles = researchFiles
    .filter(file => {
      if (filterBrand && file.brand && file.brand.toLowerCase() !== filterBrand.toLowerCase()) return false;
      if (filterProjectType && file.projectType && file.projectType.toLowerCase() !== filterProjectType.toLowerCase()) return false;
      if (filterApproved === 'approved' && !file.isApproved) return false;
      if (filterApproved === 'unapproved' && file.isApproved) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.isApproved !== b.isApproved) return a.isApproved ? -1 : 1;
      return b.uploadDate - a.uploadDate;
    });

  const handleAddSuggestion = (fileId: string) => {
    if (newSuggestion.trim()) {
      onAddSuggestion(fileId, newSuggestion);
      setNewSuggestion('');
      setShowSuggestionForm(false);
    }
  };

  const handleDownload = async (file: ResearchFile) => {
    setDownloading(file.id);
    try {
      await downloadKnowledgeBaseFile(file.id, file.fileName);
    } finally {
      setDownloading(null);
    }
  };

  const handleDatabricksFilesSelected = (files: Array<{ name: string; content: string; source: string }>, autoApprove: boolean) => {
    files.forEach(file => {
      const newFile: Omit<ResearchFile, 'id' | 'uploadDate'> = {
        brand,
        projectType,
        fileName: file.name,
        isApproved: autoApprove,
        fileType: 'text/plain',
        content: file.content,
        source: file.source,
      };
      onCreateResearchFile(newFile);
    });
  };

  // ── Filter bar shared by both views ────────────────────────────────────────
  const FilterBar = () => (
    <div className="flex flex-wrap gap-2 mb-3">
      <div className="flex flex-col gap-0.5 flex-1 min-w-[120px]">
        <label className="text-xs text-gray-500">Brand</label>
        <select
          value={filterBrand}
          onChange={e => setFilterBrand(e.target.value)}
          className="border-2 border-gray-300 bg-white rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Brands</option>
          {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-[140px]">
        <label className="text-xs text-gray-500">Project Type</label>
        <select
          value={filterProjectType}
          onChange={e => setFilterProjectType(e.target.value)}
          className="border-2 border-gray-300 bg-white rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Project Types</option>
          {allProjectTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-[110px]">
        <label className="text-xs text-gray-500">Status</label>
        <select
          value={filterApproved}
          onChange={e => setFilterApproved(e.target.value as 'all' | 'approved' | 'unapproved')}
          className="border-2 border-gray-300 bg-white rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="unapproved">Unapproved</option>
        </select>
      </div>
    </div>
  );

  // ── Non-researcher (manager) view ──────────────────────────────────────────
  if (role === 'non-researcher') {
    return (
      <>
        <FilterBar />
        <div className="space-y-2">
          {displayFiles.length === 0 ? (
            <div className="bg-gray-100 border-2 border-gray-300 p-4 text-center">
              <p className="text-gray-600">No files match the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayFiles.map((file) => (
                <div key={file.id} className={`bg-white border-2 rounded p-3 ${file.isApproved ? 'border-gray-300' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-gray-900 text-sm font-medium truncate">{file.fileName}</h4>
                        {file.isApproved ? (
                          <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Approved</span>
                        ) : (
                          <span className="flex-shrink-0 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Pending</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-gray-500">
                        {file.brand && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">{file.brand}</span>}
                        {file.projectType && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded">{file.projectType}</span>}
                        <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        className="px-2.5 py-1.5 border-2 border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 text-xs"
                        onClick={() => { setSelectedFile(selectedFile === file.id ? null : file.id); setShowSuggestionForm(false); }}
                      >
                        Read
                      </button>
                      <button
                        className="px-2.5 py-1.5 border-2 border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 text-xs disabled:opacity-50 flex items-center gap-1"
                        disabled={downloading === file.id}
                        onClick={() => handleDownload(file)}
                      >
                        {downloading === file.id ? '…' : <><DownloadIcon className="w-3 h-3" />Download</>}
                      </button>
                      <button
                        className="px-2.5 py-1.5 border-2 border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 text-xs"
                        onClick={() => { setSelectedFile(file.id); setShowSuggestionForm(true); }}
                      >
                        Recommend
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Read modal */}
        {selectedFile && !showSuggestionForm && (() => {
          const file = displayFiles.find(f => f.id === selectedFile);
          if (!file) return null;
          return (
            <div className="fixed inset-y-0 left-0 right-[350px] bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFile(null)}>
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="border-b-2 border-gray-300 p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-900 font-medium">{file.fileName}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {file.brand && <span className="mr-2">{file.brand}</span>}
                      {file.projectType && <span className="mr-2">· {file.projectType}</span>}
                      · {new Date(file.uploadDate).toLocaleDateString()}
                      {file.isApproved
                        ? <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">Approved</span>
                        : <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Pending</span>}
                    </p>
                  </div>
                  <button onClick={() => setSelectedFile(null)} aria-label="Close file detail" className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded p-4 text-sm">
                    {file.content ? (
                      <div className="space-y-2">
                        {file.source && <p className="text-xs text-gray-400 border-b pb-2"><strong>Source:</strong> {file.source}</p>}
                        <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">{file.content}</pre>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">File content not yet loaded. Use Download to retrieve the full file.</p>
                    )}
                  </div>
                </div>
                <div className="border-t-2 border-gray-300 p-4 flex justify-between items-center">
                  <button onClick={() => setSelectedFile(null)} className="px-4 py-2 border-2 border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 text-sm">Close</button>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 border-2 border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 text-sm flex items-center gap-1.5 disabled:opacity-50"
                      disabled={downloading === file.id}
                      onClick={() => handleDownload(file)}
                    >
                      <DownloadIcon className="w-4 h-4" />{downloading === file.id ? 'Downloading…' : 'Download'}
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm" onClick={() => setShowSuggestionForm(true)}>
                      Recommend Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Recommend modal */}
        {selectedFile && showSuggestionForm && (() => {
          const file = displayFiles.find(f => f.id === selectedFile);
          if (!file) return null;
          return (
            <div className="fixed inset-y-0 left-0 right-[350px] bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setShowSuggestionForm(false); setNewSuggestion(''); }}>
              <div className="bg-white rounded-lg max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <div className="border-b-2 border-gray-300 p-4 flex items-center justify-between">
                  <h3 className="text-gray-900 font-medium">Recommend Edit: {file.fileName}</h3>
                  <button onClick={() => { setShowSuggestionForm(false); setNewSuggestion(''); }} aria-label="Close suggestion form" className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-4">
                  <textarea
                    className="w-full h-32 border-2 border-gray-300 bg-white rounded p-3 text-gray-700 resize-none focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="Describe the edit or improvement you'd like to suggest..."
                    value={newSuggestion}
                    onChange={e => setNewSuggestion(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm" onClick={() => { handleAddSuggestion(file.id); setShowSuggestionForm(false); }}>
                      Submit
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 text-sm" onClick={() => { setShowSuggestionForm(false); setNewSuggestion(''); }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </>
    );
  }

  // ── Researcher view ────────────────────────────────────────────────────────
  const fileSuggestions = (fileId: string) => editSuggestions.filter(s => s.researchFileId === fileId);

  return (
    <div className="space-y-3">
      <FilterBar />
      <div className="bg-purple-50 border-2 border-purple-200 p-2">
        <h3 className="text-purple-900 leading-tight">Research Management Dashboard</h3>
        <p className="text-purple-700 text-sm">Manage research files for {brand} - {projectType}</p>
      </div>

      <div className="bg-white border-2 border-gray-300 p-3">
        <h4 className="text-gray-900 mb-3">Upload New Research File</h4>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xlsx,.xls,.csv"
          className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onCreateResearchFile({ brand, projectType, fileName: file.name, isApproved: false, fileType: file.type });
              e.target.value = '';
            }
          }}
        />
        <div className="mt-3 pt-3 border-t-2 border-gray-200">
          <button onClick={() => setShowDatabricksBrowser(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            <Database className="w-4 h-4" />Browse Databricks Files
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {displayFiles.length === 0 ? (
          <div className="bg-gray-100 border-2 border-gray-300 p-4 text-center">
            <p className="text-gray-600">No files match the selected filters.</p>
          </div>
        ) : (
          displayFiles.map((file) => {
            const suggestions = fileSuggestions(file.id);
            return (
              <div key={file.id} className="bg-white border-2 border-gray-300 p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-gray-900">{file.fileName}</h4>
                      {file.isApproved
                        ? <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Approved</span>
                        : <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Pending Approval</span>}
                      {(!file.contentSummary || file.contentSummary.trim() === '') && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">Unprocessed</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-gray-500">
                      {file.brand && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">{file.brand}</span>}
                      {file.projectType && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded">{file.projectType}</span>}
                      <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                      {suggestions.length > 0 && <span className="text-orange-600">{suggestions.length} suggestion{suggestions.length > 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="px-3 py-1.5 border-2 border-gray-400 bg-white text-gray-700 rounded hover:bg-gray-50 text-sm" onClick={() => { setSelectedFile(selectedFile === file.id ? null : file.id); setShowSuggestionForm(false); }}>
                      Read
                    </button>
                    {canApproveResearch && (
                      <button
                        className={`px-3 py-1.5 border-2 rounded text-sm ${file.isApproved ? 'border-gray-400 bg-white text-gray-700 hover:bg-gray-50' : 'border-green-600 bg-green-600 text-white hover:bg-green-700'}`}
                        onClick={() => onToggleApproval(file.id)}
                      >
                        {file.isApproved ? 'Unapprove' : 'Approve'}
                      </button>
                    )}
                  </div>
                </div>
                {suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t-2 border-gray-200">
                    <h5 className="text-gray-900 mb-2 text-sm">Suggestions:</h5>
                    <div className="space-y-2">
                      {suggestions.map((suggestion) => (
                        <div key={suggestion.id} className="bg-gray-50 border-2 border-gray-300 p-2">
                          <p className="text-gray-700 text-sm">{suggestion.suggestion}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-600">By {suggestion.suggestedBy} on {new Date(suggestion.timestamp).toLocaleDateString()}</p>
                            <select value={suggestion.status} onChange={e => onUpdateSuggestionStatus(suggestion.id, e.target.value as any)} className="text-xs border-2 border-gray-300 rounded px-2 py-1 bg-white">
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="implemented">Implemented</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showDatabricksBrowser && (
        <DatabricksFileBrowser open={showDatabricksBrowser} onClose={() => setShowDatabricksBrowser(false)} onFilesSelected={handleDatabricksFilesSelected} userRole={role} />
      )}

      {selectedFile && !showSuggestionForm && (() => {
        const file = displayFiles.find(f => f.id === selectedFile);
        if (!file) return null;
        return (
          <div className="fixed inset-y-0 left-0 right-[350px] bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFile(null)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="border-b-2 border-gray-300 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 font-medium">{file.fileName}</h3>
                  <p className="text-gray-500 text-sm">
                    {file.fileType} · {new Date(file.uploadDate).toLocaleDateString()}
                    {file.isApproved
                      ? <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">Approved</span>
                      : <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Pending</span>}
                  </p>
                </div>
                <button onClick={() => setSelectedFile(null)} aria-label="Close file detail" className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-gray-50 border-2 border-gray-300 rounded p-4 text-sm">
                  {file.content ? (
                    <div className="space-y-3">
                      {file.source && <p className="text-xs text-gray-400 border-b pb-2"><strong>Source:</strong> {file.source}</p>}
                      <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">{file.content}</pre>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">File content not yet loaded. Use Download to retrieve the full file.</p>
                  )}
                </div>
              </div>
              <div className="border-t-2 border-gray-300 p-4 flex justify-between">
                <button onClick={() => setSelectedFile(null)} className="px-4 py-2 border-2 border-gray-400 bg-white text-gray-700 rounded hover:bg-gray-50 text-sm">Close</button>
                <div className="flex gap-2">
                  {canApproveResearch && !file.isApproved && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" onClick={() => { onToggleApproval(file.id); setSelectedFile(null); }}>
                      Approve File
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
