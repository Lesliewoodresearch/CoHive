import React, { useState } from 'react';
import { BookOpen, Tag, Globe, Building2, ChevronRight, Sparkles } from 'lucide-react';
import { STORY_CATEGORIES, StoryCategory, StorySubtype } from '@/data/storyTypes';
import type { KbMode, Scope } from './AssessmentModal';

interface ResearchFile {
  id: string;
  brand: string;
  projectType: string;
  fileName: string;
  isApproved: boolean;
  uploadDate: number;
  fileType: string;
  content?: string;
  scope?: 'general' | 'category' | 'brand';
}

interface StoriesViewProps {
  brand: string;
  projectType: string;
  researchFiles: ResearchFile[];
  onGenerate: (params: {
    category: StoryCategory;
    subtype: StorySubtype;
    kbMode: KbMode;
    scope: Scope;
  }) => void;
}

const KB_MODE_OPTIONS: { value: KbMode; label: string; description: string; activeClasses: string }[] = [
  {
    value: 'hard-forbidden',
    label: 'Knowledge Base Only',
    description: 'Every claim must come from KB files — no general knowledge',
    activeClasses: 'bg-red-50 border-red-400 text-red-800',
  },
  {
    value: 'strong-preference',
    label: 'Knowledge Base Preferred',
    description: 'Strongly prefer KB — general knowledge only when KB is silent',
    activeClasses: 'bg-amber-50 border-amber-400 text-amber-800',
  },
  {
    value: 'equal-weight',
    label: 'Knowledge Base + General',
    description: 'KB and general knowledge equally weighted',
    activeClasses: 'bg-blue-50 border-blue-400 text-blue-800',
  },
];

const SCOPE_OPTIONS: { value: Scope; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'brand', label: 'Brand', description: 'Brand-specific data only', icon: <Building2 className="w-3.5 h-3.5" /> },
  { value: 'category', label: 'Category', description: 'Brand + category benchmarks', icon: <Tag className="w-3.5 h-3.5" /> },
  { value: 'general', label: 'General', description: 'Broad market + brand + category', icon: <Globe className="w-3.5 h-3.5" /> },
];

const ARC_LABEL: Record<string, string> = {
  'rise': '↑ Rise',
  'fall': '↓ Fall',
  'fall-rise': '↓ then ↑',
  'rise-fall': '↑ then ↓',
  'rise-fall-rise': '↑ ↓ ↑',
  'fall-rise-fall': '↓ ↑ ↓',
};

export function StoriesView({ brand, researchFiles, onGenerate }: StoriesViewProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubtypeId, setSelectedSubtypeId] = useState<string | null>(null);
  const [kbMode, setKbMode] = useState<KbMode>('equal-weight');
  const [scope, setScope] = useState<Scope>('brand');
  const [showSteps, setShowSteps] = useState(false);

  const selectedCategory = STORY_CATEGORIES.find(c => c.id === selectedCategoryId) ?? null;
  const selectedSubtype = selectedCategory?.subtypes.find(s => s.id === selectedSubtypeId) ?? null;

  const kbFileNames = researchFiles
    .filter(f => f.isApproved)
    .map(f => f.fileName);

  const handleCategorySelect = (id: string) => {
    if (id === selectedCategoryId) return;
    setSelectedCategoryId(id);
    setSelectedSubtypeId(null);
    setShowSteps(false);
  };

  const handleSubtypeSelect = (id: string) => {
    setSelectedSubtypeId(id);
    setShowSteps(false);
  };

  const handleGenerate = () => {
    if (!selectedCategory || !selectedSubtype) return;
    onGenerate({ category: selectedCategory, subtype: selectedSubtype, kbMode, scope });
  };

  return (
    <div className="space-y-5">

      {/* ── Category selector ── */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-2">Story Type</p>
        <div className="grid grid-cols-1 gap-2">
          {STORY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                selectedCategoryId === cat.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div>
                <span className={`font-semibold text-sm block ${selectedCategoryId === cat.id ? 'text-purple-800' : 'text-gray-800'}`}>
                  {cat.label}
                </span>
                <span className="text-xs text-gray-500">{cat.description}</span>
              </div>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${selectedCategoryId === cat.id ? 'text-purple-600 rotate-90' : 'text-gray-400'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Subtype selector ── */}
      {selectedCategory && (
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2">{selectedCategory.label} — Choose a Story</p>
          <div className="space-y-1.5">
            {selectedCategory.subtypes.map(sub => (
              <button
                key={sub.id}
                onClick={() => handleSubtypeSelect(sub.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                  selectedSubtypeId === sub.id
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${selectedSubtypeId === sub.id ? 'text-purple-800' : 'text-gray-800'}`}>
                      {sub.label}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{ARC_LABEL[sub.arc]}</span>
                    {sub.dualPOV && (
                      <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded">dual POV</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 truncate block">{sub.arcDescription}</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ml-2 flex items-center justify-center ${
                  selectedSubtypeId === sub.id ? 'border-purple-500' : 'border-gray-300'
                }`}>
                  {selectedSubtypeId === sub.id && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Steps preview toggle ── */}
      {selectedSubtype && (
        <div>
          <button
            onClick={() => setShowSteps(v => !v)}
            className="text-xs text-purple-700 underline-offset-2 hover:underline flex items-center gap-1"
          >
            {showSteps ? 'Hide' : 'Preview'} story steps ({selectedSubtype.steps.length} steps
            {selectedSubtype.dualPOV ? ', 2 rounds' : ', 1 round'})
          </button>
          {showSteps && (
            <div className="mt-2 space-y-1.5">
              {selectedSubtype.steps.map((step, i) => (
                <div key={i} className="flex gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">{step.label}</span>
                    <span className="text-xs text-gray-500 leading-snug">{step.instruction}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── KB Mode ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-semibold text-gray-800">Knowledge Base Usage</p>
        </div>
        <p className="text-xs text-gray-500 mb-2">Controls how much the AI draws from your KB files when generating the story.</p>
        <div className="space-y-1.5">
          {KB_MODE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setKbMode(opt.value)}
              className={`w-full flex items-start gap-3 p-2.5 rounded-lg border-2 text-left transition-all ${
                kbMode === opt.value ? opt.activeClasses : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                kbMode === opt.value ? 'border-current' : 'border-gray-300'
              }`}>
                {kbMode === opt.value && <div className="w-2 h-2 rounded-full bg-current" />}
              </div>
              <div>
                <span className="font-semibold text-sm block">{opt.label}</span>
                <span className="text-xs opacity-80">{opt.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Scope ── */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Information Scope</p>
        <p className="text-xs text-gray-500 mb-2">How broadly should the story draw when generating?</p>
        <div className="grid grid-cols-3 gap-2">
          {SCOPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setScope(opt.value)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 text-center transition-all ${
                scope === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={scope === opt.value ? 'text-blue-600' : 'text-gray-400'}>{opt.icon}</span>
              <span className={`font-semibold text-xs ${scope === opt.value ? 'text-blue-800' : 'text-gray-700'}`}>{opt.label}</span>
              <span className="text-xs text-gray-500 leading-tight">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── KB files preview ── */}
      {kbFileNames.length > 0 && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-medium mb-2">📚 Knowledge Base files ({kbFileNames.length}):</p>
          <div className="flex flex-wrap gap-1.5">
            {kbFileNames.map((name, i) => (
              <span key={i} className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs text-gray-600">{name}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Generate button ── */}
      <button
        onClick={handleGenerate}
        disabled={!selectedSubtype}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
          selectedSubtype
            ? 'bg-purple-700 hover:bg-purple-800 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        {selectedSubtype
          ? `Generate ${selectedSubtype.label} Story${selectedSubtype.dualPOV ? ' (2 rounds)' : ''}`
          : 'Select a story type to generate'}
      </button>

      {brand && selectedSubtype && (
        <p className="text-xs text-center text-gray-400">
          Story will be generated for <strong>{brand}</strong>
        </p>
      )}
    </div>
  );
}
