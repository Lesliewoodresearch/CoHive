import { useState, useEffect, useRef, useCallback } from 'react';
import { X, CircleCheck, CircleAlert } from 'lucide-react';
import gemIcon from 'figma:asset/53dc6cf554f69e479cfbd60a46741f158d11dd21.png';
import { GemCheckCoalReviewPanel, type ReviewItem } from './GemCheckCoalReviewPanel';
import { saveGem, type CitedFile } from '../utils/databricksAPI';
import { getValidSession } from '../utils/databricksAuth';
import { LoadingGem, SpinHex } from './LoadingGem';
import { executeAIPrompt } from '../utils/databricksAI';
import type { StoryCategory, StorySubtype } from '../data/storyTypes';
import type { KbMode, Scope } from './AssessmentModal';
import type { IterationGem } from './AssessmentModal';

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

interface StoryRound {
  roundNumber: number;
  label: string;
  content: string;
}

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: string;
  projectType: string;
  category: StoryCategory;
  subtype: StorySubtype;
  kbMode: KbMode;
  scope: Scope;
  researchFiles: ResearchFile[];
  kbFileNames: string[];
  userEmail: string;
  userRole?: string;
  modelEndpoint?: string;
  iterationGems?: IterationGem[];
  iterationChecks?: Array<{ text: string; hexId: string; hexLabel: string }>;
  iterationCoal?: Array<{ text: string; hexId: string; hexLabel: string }>;
  onGemSaved?: (gem: IterationGem) => void;
  onReviewConfirmed?: (items: ReviewItem[]) => void;
  onAcceptResults?: (results: {
    rounds: StoryRound[];
    hexId: string;
    hexLabel: string;
  }) => void;
}

// Build the story generation prompt for a given round/POV
function buildStoryPrompt(params: {
  brand: string;
  projectType: string;
  category: StoryCategory;
  subtype: StorySubtype;
  kbMode: KbMode;
  scope: Scope;
  kbContent: string;
  roundIndex: number; // 0 = first POV/single, 1 = second POV
}): { systemPrompt: string; prompt: string } {
  const { brand, projectType, category, subtype, kbMode, scope, kbContent, roundIndex } = params;

  const kbInstruction = kbMode === 'hard-forbidden'
    ? 'You MUST draw exclusively from the provided Knowledge Base content. General knowledge is strictly forbidden. Every claim must be grounded in the KB material.'
    : kbMode === 'strong-preference'
    ? 'Strongly prefer the provided Knowledge Base content. Only use general knowledge when the KB is completely silent on a topic.'
    : 'Use both the Knowledge Base content and your general knowledge equally. All specific brand claims must reference the KB material.';

  const scopeInstruction = scope === 'brand'
    ? `Focus exclusively on ${brand} brand data and brand-specific insights.`
    : scope === 'category'
    ? `Draw from ${brand} brand data and broader category benchmarks.`
    : `Draw from ${brand} brand data, category context, and broad market knowledge.`;

  const isDualPOV = subtype.dualPOV;
  const povLabel = isDualPOV
    ? roundIndex === 0
      ? "Tell the story from the PROTAGONIST's perspective — the hero, the brand, the challenger, or the one seeking transformation."
      : "Tell the story from the ANTAGONIST or CHALLENGER's perspective — the force of opposition, the incumbent, or the contrasting viewpoint."
    : '';

  const systemPrompt = `You are a master narrative storyteller creating brand strategy stories for ${brand}.

Your role is to write compelling, structured narrative stories that reveal brand truths through archetypal storytelling frameworks. The stories should be vivid, specific to the brand, and professionally useful as strategic tools.

${kbInstruction}

${scopeInstruction}

Writing style:
- Write in fluid, engaging prose — not bullet points
- Each story step should flow into the next as a continuous narrative
- Be specific: use concrete details, real brand attributes, and human-scale moments
- Stories should be 400–600 words total
- Each story step should be clearly labeled with a heading`;

  const stepsBlock = subtype.steps.map((step, i) =>
    `**Step ${i + 1}: ${step.label}**\n${step.instruction}`
  ).join('\n\n');

  const kbSection = kbContent.trim()
    ? `\n\n## Knowledge Base Content\n${kbContent.trim()}`
    : '';

  const prompt = `Generate a ${subtype.label} story (${category.label} category) for ${brand}.

${isDualPOV ? `**Perspective:** ${povLabel}\n\n` : ''}Project context: ${projectType || 'Brand strategy'}

Follow these story steps exactly:

${stepsBlock}
${kbSection}

Write the complete story now, with each step as a clearly labeled section. Make it vivid, brand-specific, and strategically useful.`;

  return { systemPrompt, prompt };
}

export function StoryModal({
  isOpen,
  onClose,
  brand,
  projectType,
  category,
  subtype,
  kbMode,
  scope,
  researchFiles,
  kbFileNames,
  userEmail,
  userRole = 'user',
  modelEndpoint = 'databricks-claude-sonnet-4-6',
  iterationGems,
  iterationChecks,
  iterationCoal,
  onGemSaved,
  onReviewConfirmed,
  onAcceptResults,
}: StoryModalProps) {
  const [rounds, setRounds] = useState<StoryRound[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [floatingBtn, setFloatingBtn] = useState<{
    x: number; y: number; text: string; fileId: string | null; fileName: string | null;
  } | null>(null);
  const [savingGem, setSavingGem] = useState(false);
  const [savingCheck, setSavingCheck] = useState(false);
  const [savingCoal, setSavingCoal] = useState(false);
  const [savedGemItems, setSavedGemItems] = useState<Array<{ text: string }>>([]);
  const [savedCheckItems, setSavedCheckItems] = useState<Array<{ text: string }>>([]);
  const [savedCoalItems, setSavedCoalItems] = useState<Array<{ text: string }>>([]);
  const [gemToasts, setGemToasts] = useState<Array<{ id: string; text: string }>>([]);
  const [checkToasts, setCheckToasts] = useState<Array<{ id: string; text: string }>>([]);
  const [coalToasts, setCoalToasts] = useState<Array<{ id: string; text: string }>>([]);
  const [showReviewPanel, setShowReviewPanel] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const hexId = 'stories';
  const hexLabel = 'Stories';

  const runStory = useCallback(async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    setIsRunning(true);
    setError(null);
    setRounds([]);
    setActiveTab(null);

    try {
      // Gather KB content from approved research files matching scope
      const kbContent = researchFiles
        .filter(f => f.isApproved && kbFileNames.includes(f.fileName) && f.content)
        .map(f => `[${f.fileName}]\n${f.content}`)
        .join('\n\n---\n\n');

      const totalRounds = subtype.dualPOV ? 2 : 1;

      for (let i = 0; i < totalRounds; i++) {
        const roundLabel = totalRounds === 1
          ? subtype.label
          : i === 0
          ? `${subtype.label} — Protagonist`
          : `${subtype.label} — Challenger`;

        const { systemPrompt, prompt } = buildStoryPrompt({
          brand, projectType, category, subtype, kbMode, scope, kbContent, roundIndex: i,
        });

        const result = await executeAIPrompt({
          prompt,
          systemPrompt,
          modelEndpoint,
          maxTokens: 1200,
          temperature: 0.75,
          userEmail,
          userRole,
        });

        if (!result.success) {
          throw new Error(result.error || 'Story generation failed');
        }

        const round: StoryRound = {
          roundNumber: i + 1,
          label: roundLabel,
          content: result.response,
        };

        setRounds(prev => [...prev, round]);
        setActiveTab(prev => prev === null ? round.roundNumber : prev);
      }

      setIsComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Story generation failed');
    } finally {
      setIsRunning(false);
    }
  }, [brand, projectType, category, subtype, kbMode, scope, researchFiles, kbFileNames, userEmail, userRole, modelEndpoint]);

  useEffect(() => {
    if (isOpen && !hasStarted.current) {
      runStory();
    }
  }, [isOpen, runStory]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      hasStarted.current = false;
      setRounds([]);
      setActiveTab(null);
      setIsComplete(false);
      setError(null);
      setFloatingBtn(null);
      setSavedGemItems([]);
      setSavedCheckItems([]);
      setSavedCoalItems([]);
      setShowReviewPanel(false);
    }
  }, [isOpen]);

  // Text selection → floating action buttons
  useEffect(() => {
    const handleSelectionChange = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !selection.toString().trim()) {
          setFloatingBtn(null);
          return;
        }
        const text = selection.toString().trim();
        if (text.length < 10) { setFloatingBtn(null); return; }

        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (!range || !contentRef.current?.contains(range.commonAncestorContainer)) {
          setFloatingBtn(null);
          return;
        }

        const rect = range.getBoundingClientRect();
        const modalRect = contentRef.current?.getBoundingClientRect();
        if (modalRect) {
          setFloatingBtn({ x: rect.left - modalRect.left + rect.width / 2, y: rect.bottom - modalRect.top, text, fileId: null, fileName: null });
        }
      }, 50);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (floatingBtn && (e.key === 'Enter' || (e.key === 's' && (e.metaKey || e.ctrlKey)))) {
        e.preventDefault();
        handleSaveGem();
      }
      if (e.key === 'Escape') { setFloatingBtn(null); window.getSelection()?.removeAllRanges(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [floatingBtn]);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) { setFloatingBtn(null); return; }
    const text = selection.toString().trim();
    if (text.length < 10) { setFloatingBtn(null); return; }
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const modalRect = contentRef.current?.getBoundingClientRect();
    if (modalRect) {
      setFloatingBtn({ x: rect.left - modalRect.left + rect.width / 2, y: rect.bottom - modalRect.top, text, fileId: null, fileName: null });
    }
  }, []);

  const handleSaveGem = async () => {
    if (!floatingBtn) return;
    setSavingGem(true);
    try {
      const session = await getValidSession();
      if (!session) throw new Error('Not authenticated');
      const result = await saveGem({
        gemText: floatingBtn.text,
        assessmentType: subtype.label,
        hexId, hexLabel, brand, projectType,
        createdBy: userEmail,
        accessToken: session.accessToken,
        workspaceHost: session.workspaceHost,
      });
      if (result.success) {
        setSavedGemItems(prev => [...prev, { text: floatingBtn.text }]);
        onGemSaved?.({ gemText: floatingBtn.text, fileName: null, hexId, hexLabel });
        const toastId = Date.now().toString();
        setGemToasts(prev => [...prev, { id: toastId, text: floatingBtn.text.substring(0, 60) + (floatingBtn.text.length > 60 ? '…' : '') }]);
        setTimeout(() => setGemToasts(prev => prev.filter(t => t.id !== toastId)), 3500);
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (err) {
      alert(`Failed to save gem: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSavingGem(false);
      setFloatingBtn(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleSaveCoal = () => {
    if (!floatingBtn) return;
    setSavingCoal(true);
    try {
      const existing = JSON.parse(localStorage.getItem('cohive_coal') || '[]');
      localStorage.setItem('cohive_coal', JSON.stringify([...existing, { id: Date.now().toString(), text: floatingBtn.text, hexId, hexLabel, timestamp: Date.now() }]));
      setSavedCoalItems(prev => [...prev, { text: floatingBtn.text }]);
      const toastId = `coal-${Date.now()}`;
      setCoalToasts(prev => [...prev, { id: toastId, text: floatingBtn.text.substring(0, 60) + (floatingBtn.text.length > 60 ? '…' : '') }]);
      setTimeout(() => setCoalToasts(prev => prev.filter(t => t.id !== toastId)), 3500);
      setFloatingBtn(null);
      window.getSelection()?.removeAllRanges();
    } finally {
      setSavingCoal(false);
    }
  };

  const handleSaveCheck = () => {
    if (!floatingBtn) return;
    setSavingCheck(true);
    try {
      const existing = JSON.parse(localStorage.getItem('cohive_checks') || '[]');
      localStorage.setItem('cohive_checks', JSON.stringify([...existing, { id: Date.now().toString(), text: floatingBtn.text, hexId, hexLabel, timestamp: Date.now() }]));
      setSavedCheckItems(prev => [...prev, { text: floatingBtn.text }]);
      const toastId = `check-${Date.now()}`;
      setCheckToasts(prev => [...prev, { id: toastId, text: floatingBtn.text.substring(0, 60) + (floatingBtn.text.length > 60 ? '…' : '') }]);
      setTimeout(() => setCheckToasts(prev => prev.filter(t => t.id !== toastId)), 3500);
      setFloatingBtn(null);
      window.getSelection()?.removeAllRanges();
    } finally {
      setSavingCheck(false);
    }
  };

  const handleAcceptAndClose = () => {
    const items: ReviewItem[] = [
      ...savedGemItems.map((g, i) => ({ id: `gem-${Date.now()}-${i}`, type: 'gem' as const, text: g.text, hexId, hexLabel, included: true, rank: i })),
      ...savedCheckItems.map((c, i) => ({ id: `check-${Date.now()}-${i}`, type: 'check' as const, text: c.text, hexId, hexLabel, included: true, rank: i })),
      ...savedCoalItems.map((c, i) => ({ id: `coal-${Date.now()}-${i}`, type: 'coal' as const, text: c.text, hexId, hexLabel, included: true, rank: i })),
    ];

    if (items.length > 0) {
      setShowReviewPanel(true);
    } else {
      onAcceptResults?.({ rounds, hexId, hexLabel });
      onClose();
    }
  };

  const handleReviewConfirmed = (items: ReviewItem[]) => {
    onReviewConfirmed?.(items);
    onAcceptResults?.({ rounds, hexId, hexLabel });
    setShowReviewPanel(false);
    onClose();
  };

  const activeRound = rounds.find(r => r.roundNumber === activeTab);

  if (!isOpen) return null;

  if (showReviewPanel) {
    const reviewItems: ReviewItem[] = [
      ...savedGemItems.map((g, i) => ({ id: `gem-${i}`, type: 'gem' as const, text: g.text, hexId, hexLabel, included: true, rank: i })),
      ...savedCheckItems.map((c, i) => ({ id: `check-${i}`, type: 'check' as const, text: c.text, hexId, hexLabel, included: true, rank: i })),
      ...savedCoalItems.map((c, i) => ({ id: `coal-${i}`, type: 'coal' as const, text: c.text, hexId, hexLabel, included: true, rank: i })),
    ];
    return (
      <GemCheckCoalReviewPanel
        isOpen={true}
        items={reviewItems}
        brand={brand}
        projectType={projectType}
        hexLabel={hexLabel}
        userEmail={userEmail}
        userRole={userRole}
        onConfirm={handleReviewConfirmed}
        onClose={() => setShowReviewPanel(false)}
      />
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 right-[350px] z-50 flex items-center justify-center p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
      <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: '700px', maxHeight: '85vh' }}>

        {/* Header */}
        <div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-xl">
          <div>
            <h2 className="text-gray-900 font-semibold text-lg leading-tight">
              {category.label} · {subtype.label}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {brand}{subtype.dualPOV ? ' · Dual perspective' : ''}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading state */}
        {isRunning && rounds.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <LoadingGem />
            <p className="text-gray-600 font-medium">Generating {subtype.label} story…</p>
            <p className="text-gray-400 text-sm">Writing for {brand}</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6">
            <CircleAlert className="w-10 h-10 text-red-500" />
            <p className="text-red-700 font-medium text-center">{error}</p>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">
              Close
            </button>
          </div>
        )}

        {/* Content */}
        {rounds.length > 0 && (
          <>
            {/* Tab bar */}
            <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b border-gray-200 overflow-x-auto flex-shrink-0">
              {rounds.map(r => (
                <button
                  key={r.roundNumber}
                  onClick={() => setActiveTab(r.roundNumber)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-t-lg border border-b-0 transition-colors whitespace-nowrap ${
                    activeTab === r.roundNumber
                      ? 'bg-white text-gray-900 border-gray-300 -mb-px'
                      : 'bg-gray-50 text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
              {isRunning && rounds.length < (subtype.dualPOV ? 2 : 1) && (
                <div className="px-3 py-1.5 text-xs text-gray-400 flex items-center gap-1.5">
                  <SpinHex className="w-3 h-3" />
                  Generating…
                </div>
              )}
            </div>

            {/* Story content */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto px-6 py-5 relative"
              onMouseUp={handleMouseUp}
            >
              {activeRound && (
                <div className="prose prose-sm max-w-none">
                  <div className="p-4 rounded-lg border border-purple-200 bg-purple-50/40 whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                    {activeRound.content}
                  </div>
                </div>
              )}

              {/* Floating gem/check/coal buttons */}
              {floatingBtn && (
                <div
                  className="absolute z-10 flex items-center gap-1 bg-white border border-gray-300 rounded-lg shadow-lg px-2 py-1.5"
                  style={{ left: floatingBtn.x - 60, top: floatingBtn.y + 8 }}
                >
                  <button
                    onClick={handleSaveGem}
                    disabled={savingGem}
                    title="Save as Gem"
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-yellow-50 text-xs font-medium text-yellow-800 transition-colors"
                  >
                    <img src={gemIcon} alt="Gem" className="w-3.5 h-3.5" />
                    {savingGem ? '…' : 'Gem'}
                  </button>
                  <div className="w-px h-4 bg-gray-300" />
                  <button
                    onClick={handleSaveCheck}
                    disabled={savingCheck}
                    title="Save as Check"
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-green-50 text-xs font-medium text-green-800 transition-colors"
                  >
                    <CircleCheck className="w-3.5 h-3.5" />
                    {savingCheck ? '…' : 'Check'}
                  </button>
                  <div className="w-px h-4 bg-gray-300" />
                  <button
                    onClick={handleSaveCoal}
                    disabled={savingCoal}
                    title="Save as Coal"
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-xs font-medium text-gray-700 transition-colors"
                  >
                    🪨 {savingCoal ? '…' : 'Coal'}
                  </button>
                </div>
              )}
            </div>

            {/* Saved counts */}
            {isComplete && (savedGemItems.length + savedCheckItems.length + savedCoalItems.length) > 0 && (
              <div className="px-6 py-2 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                {savedGemItems.length > 0 && (
                  <span className="flex items-center gap-1">
                    <img src={gemIcon} alt="Gems" className="w-3 h-3" />
                    {savedGemItems.length} gem{savedGemItems.length !== 1 ? 's' : ''}
                  </span>
                )}
                {savedCheckItems.length > 0 && (
                  <span className="flex items-center gap-1 text-green-700">
                    <CircleCheck className="w-3 h-3" />
                    {savedCheckItems.length} check{savedCheckItems.length !== 1 ? 's' : ''}
                  </span>
                )}
                {savedCoalItems.length > 0 && (
                  <span>🪨 {savedCoalItems.length} coal{savedCoalItems.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            )}

            {/* Footer */}
            {isComplete && (
              <div className="bg-white border-t-2 border-gray-200 px-6 py-4 flex items-center justify-end flex-shrink-0 rounded-b-xl">
                <button
                  onClick={handleAcceptAndClose}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm"
                >
                  <CircleCheck className="w-4 h-4" />
                  Accept &amp; Close
                </button>
              </div>
            )}
          </>
        )}

        {/* Gem toasts */}
        <div className="fixed bottom-6 right-[370px] z-60 flex flex-col gap-2 pointer-events-none">
          {gemToasts.map(t => (
            <div key={t.id} className="flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2 shadow-md text-xs text-yellow-800">
              <img src={gemIcon} alt="Gem" className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="max-w-[200px] truncate">{t.text}</span>
            </div>
          ))}
          {checkToasts.map(t => (
            <div key={t.id} className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-lg px-3 py-2 shadow-md text-xs text-green-800">
              <CircleCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="max-w-[200px] truncate">{t.text}</span>
            </div>
          ))}
          {coalToasts.map(t => (
            <div key={t.id} className="flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 shadow-md text-xs text-gray-100">
              <span>🪨</span>
              <span className="max-w-[200px] truncate">{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
