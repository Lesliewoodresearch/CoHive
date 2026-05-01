import React from 'react';
import { Sparkles } from 'lucide-react';
import { STORY_CATEGORIES, type StoryCategory, type StorySubtype } from '@/data/storyTypes';

interface StoriesViewProps {
  brand: string;
  onGenerate: (params: { category: StoryCategory; subtype: StorySubtype }) => void;
}

const ARC_LABEL: Record<string, string> = {
  'rise': '↑ Rise',
  'fall': '↓ Fall',
  'fall-rise': '↓↑',
  'rise-fall': '↑↓',
  'rise-fall-rise': '↑↓↑',
  'fall-rise-fall': '↓↑↓',
};

export function StoriesView({ brand, onGenerate }: StoriesViewProps) {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);
  const [selectedSubtypeId, setSelectedSubtypeId] = React.useState<string | null>(null);

  const selectedCategory = STORY_CATEGORIES.find(c => c.id === selectedCategoryId) ?? null;
  const selectedSubtype = selectedCategory?.subtypes.find(s => s.id === selectedSubtypeId) ?? null;

  const handleCategoryChange = (id: string) => {
    setSelectedCategoryId(id);
    setSelectedSubtypeId(null);
  };

  const handleGenerate = () => {
    if (!selectedCategory || !selectedSubtype) return;
    onGenerate({ category: selectedCategory, subtype: selectedSubtype });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-gray-900 leading-tight mb-3">
        Select a Story Type
      </h3>

      <div className="space-y-0">
        {STORY_CATEGORIES.map(cat => (
          <div key={cat.id}>
            {/* Category — level 1 radio */}
            <label className="flex items-start gap-2 p-0.5 cursor-pointer hover:bg-gray-50 rounded transition-colors">
              <input
                type="radio"
                name="storyCategory"
                value={cat.id}
                checked={selectedCategoryId === cat.id}
                onChange={() => handleCategoryChange(cat.id)}
                className="w-4 h-4 mt-0.5"
              />
              <div>
                <span className="text-gray-900 font-semibold">{cat.label}</span>
                <span className="text-sm text-gray-600 font-normal ml-2">{cat.description}</span>
              </div>
            </label>

            {/* Subtypes — level 2, shown when category selected */}
            {selectedCategoryId === cat.id && (
              <div style={{ marginLeft: '24px', paddingLeft: '12px', borderLeft: '3px solid #d8b4fe', marginTop: '4px', marginBottom: '4px' }}>
                {cat.subtypes.map(sub => (
                  <label
                    key={sub.id}
                    className="flex items-start gap-2 p-0.5 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                  >
                    <input
                      type="radio"
                      name="storySubtype"
                      value={sub.id}
                      checked={selectedSubtypeId === sub.id}
                      onChange={() => setSelectedSubtypeId(sub.id)}
                      className="w-4 h-4 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-gray-800 font-medium">{sub.label}</span>
                      <span className="text-xs text-gray-400 font-mono ml-2">{ARC_LABEL[sub.arc]}</span>
                      {sub.dualPOV && (
                        <span className="text-xs ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded">dual POV</span>
                      )}
                      <div className="text-xs text-gray-500 leading-snug">{sub.arcDescription}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!selectedSubtype}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all mt-2 ${
          selectedSubtype
            ? 'bg-purple-700 hover:bg-purple-800 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        {selectedSubtype
          ? `Generate ${selectedSubtype.label} Story`
          : 'Select a story to generate'}
      </button>

      {brand && selectedSubtype && (
        <p className="text-xs text-center text-gray-400">
          Story will be generated for <strong>{brand}</strong>
        </p>
      )}
    </div>
  );
}
