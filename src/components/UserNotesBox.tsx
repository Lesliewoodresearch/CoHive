import React, { useRef, useEffect } from 'react';
import gemIcon from 'figma:asset/53dc6cf554f69e479cfbd60a46741f158d11dd21.png';

export interface NoteEntry {
  id: string;
  type: 'note' | 'gem' | 'check' | 'coal' | 'prompt';
  text: string;
  hexLabel?: string;
}

interface UserNotesBoxProps {
  entries: NoteEntry[];
  onEntriesChange: (entries: NoteEntry[]) => void;
}

const AUTO_ENTRY_STYLES = {
  gem: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-800',
    label: 'Gem',
  },
  check: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    label: '✓ Check',
  },
  coal: {
    bg: 'bg-gray-800',
    border: 'border-gray-600',
    text: 'text-gray-100',
    label: '🪨 Coal',
  },
  prompt: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-800',
    label: '→ Direction',
  },
} as const;

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className="w-full resize-none text-sm bg-transparent border-0 outline-none p-0 leading-relaxed text-gray-700 placeholder-gray-400"
      style={{ overflow: 'hidden', minHeight: '1.5rem' }}
    />
  );
}

export function UserNotesBox({ entries, onEntriesChange }: UserNotesBoxProps) {
  const [showNotes, setShowNotes] = React.useState(true);
  const [showGems, setShowGems] = React.useState(true);
  const [showPrompts, setShowPrompts] = React.useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(entries.length);

  const hasGemEntries = entries.some((e) => ['gem', 'check', 'coal'].includes(e.type));
  const hasPromptEntries = entries.some((e) => e.type === 'prompt');

  useEffect(() => {
    if (entries.length > prevLengthRef.current) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
    prevLengthRef.current = entries.length;
  }, [entries.length]);

  const handleNoteChange = (id: string, text: string) => {
    onEntriesChange(entries.map((e) => (e.id === id ? { ...e, text } : e)));
  };

  const noteEntries = entries.filter((e) => e.type === 'note');
  const firstNoteId = noteEntries[0]?.id;

  return (
    <div className="flex flex-col h-full gap-1.5">
      {/* Progressive checkboxes */}
      <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showNotes}
            onChange={(e) => setShowNotes(e.target.checked)}
            className="w-3 h-3"
          />
          Notes
        </label>
        {hasGemEntries && (
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showGems}
              onChange={(e) => setShowGems(e.target.checked)}
              className="w-3 h-3"
            />
            <img src={gemIcon} alt="CoHive gem icon" className="w-3 h-3" />
            Gems
          </label>
        )}
        {hasPromptEntries && (
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showPrompts}
              onChange={(e) => setShowPrompts(e.target.checked)}
              className="w-3 h-3"
            />
            Prompts
          </label>
        )}
      </div>

      {/* Entry list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-1.5 min-h-0">
        {entries.map((entry) => {
          if (entry.type === 'note') {
            if (!showNotes) return null;
            return (
              <AutoResizeTextarea
                key={entry.id}
                value={entry.text}
                onChange={(text) => handleNoteChange(entry.id, text)}
                placeholder={
                  entry.id === firstNoteId && entry.text === ''
                    ? 'Add notes to be saved with each iteration...'
                    : undefined
                }
              />
            );
          }

          if (['gem', 'check', 'coal'].includes(entry.type)) {
            if (!showGems) return null;
            const style = AUTO_ENTRY_STYLES[entry.type as 'gem' | 'check' | 'coal'];
            return (
              <div
                key={entry.id}
                className={`text-xs px-2 py-1.5 rounded border flex-shrink-0 flex items-start gap-1 ${style.bg} ${style.border} ${style.text}`}
              >
                {entry.type === 'gem' ? (
                  <img src={gemIcon} alt="CoHive gem icon" className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
                ) : (
                  <span className="font-semibold">{style.label}</span>
                )}
                {entry.hexLabel && (
                  <span className="opacity-60">[{entry.hexLabel}]</span>
                )}
                <span className="flex-1">
                  {entry.text.length > 140
                    ? entry.text.substring(0, 140) + '…'
                    : entry.text}
                </span>
              </div>
            );
          }

          if (entry.type === 'prompt') {
            if (!showPrompts) return null;
            const style = AUTO_ENTRY_STYLES.prompt;
            return (
              <div
                key={entry.id}
                className={`text-xs px-2 py-1.5 rounded border flex-shrink-0 ${style.bg} ${style.border} ${style.text}`}
              >
                <span className="font-semibold mr-1">{style.label}</span>
                {entry.hexLabel && (
                  <span className="opacity-60 mr-1">[{entry.hexLabel}]</span>
                )}
                <span>{entry.text}</span>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
