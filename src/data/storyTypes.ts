export interface StoryStep {
  label: string;
  instruction: string;
}

export interface StorySubtype {
  id: string;
  label: string;
  arc: 'rise' | 'fall' | 'fall-rise' | 'rise-fall' | 'rise-fall-rise' | 'fall-rise-fall';
  arcDescription: string;
  dualPOV: boolean; // true = 2 rounds (protagonist + antagonist / challenger), false = 1 round
  steps: StoryStep[];
}

export interface StoryCategory {
  id: string;
  label: string;
  description: string;
  subtypes: StorySubtype[];
}

export const STORY_CATEGORIES: StoryCategory[] = [
  {
    id: 'fairy-tales',
    label: 'Fairy Tales',
    description: 'Archetypal narratives with magic, transformation, and moral lessons',
    subtypes: [
      {
        id: 'cinderella',
        label: 'Cinderella',
        arc: 'fall-rise',
        arcDescription: 'Humble beginnings → hardship → transformation → triumph',
        dualPOV: false,
        steps: [
          { label: 'Ordinary World', instruction: 'The CONSUMER is the protagonist. Show them in their constrained, underserved everyday situation — the frustrations they accept, the limitations imposed on them, the world that underestimates them. The brand does not appear yet.' },
          { label: 'The Hardship', instruction: 'Deepen the consumer\'s struggle. The oppressive force — a rival brand, an incumbent system, or the category status quo — makes things worse. If the brand being told is playing the villain, show it here as part of what holds the consumer back.' },
          { label: 'The Helper / Magic', instruction: 'The brand enters as the unexpected enabler — the fairy godmother. Show precisely what it gives the consumer that nothing else could: the tool, the access, the confidence, the capability. This is the brand\'s moment, but the transformation belongs to the consumer.' },
          { label: 'The Ball / Moment of Possibility', instruction: 'The consumer steps into the world they deserve, enabled by the brand. Show them recognised, capable, and thriving in a way that was previously impossible. The brand is the reason, but the consumer is the star.' },
          { label: 'The Stroke of Midnight', instruction: 'Introduce the threat of reversal — what happens if the consumer loses this advantage, if the brand fails them, or if the old forces reassert themselves. Show the stakes from the consumer\'s perspective.' },
          { label: 'The Glass Slipper', instruction: 'The consumer\'s transformation is made permanent. What the brand gave them cannot be taken back — the capability, the confidence, or the belonging is now theirs. The rival or oppressive force is diminished. The consumer is elevated for good.' },
        ],
      },
      {
        id: 'ugly-duckling',
        label: 'Ugly Duckling',
        arc: 'fall-rise',
        arcDescription: 'Rejection → isolation → self-discovery → belonging',
        dualPOV: false,
        steps: [
          { label: 'Misfit in the Flock', instruction: 'The CONSUMER is the ugly duckling. Show them as different, dismissed, or excluded by the mainstream — by the category, by conventional brands, or by a culture that doesn\'t see their value. The rejection is unjust and specific.' },
          { label: 'Wandering Alone', instruction: 'Show the consumer trying and failing to find a place to belong — cycling through brands or options that don\'t fit who they are. The category keeps rejecting or ignoring them.' },
          { label: 'Glimpse of the True Self', instruction: 'A small moment reveals the consumer\'s real nature — a need, a value, or an identity that the mainstream missed. The brand notices what others didn\'t. Show the brand as the first to recognise the consumer\'s true worth.' },
          { label: 'Finding the Swans', instruction: 'The brand — and the community or world it represents — welcomes the consumer without condition. Show the consumer discovering that what made them different was exactly right. The brand is the swans.' },
          { label: 'The Reflection', instruction: 'The consumer sees themselves clearly for the first time, through their relationship with the brand. What they thought was a flaw is what makes them extraordinary. The brand didn\'t change them — it revealed them.' },
        ],
      },
      {
        id: 'sleeping-beauty',
        label: 'Sleeping Beauty',
        arc: 'rise-fall-rise',
        arcDescription: 'Promise → curse/stasis → awakening → renewal',
        dualPOV: false,
        steps: [
          { label: 'The Gift and the Curse', instruction: 'The CONSUMER is Sleeping Beauty. Establish their early promise — the potential, the aspiration, the life they were heading toward — alongside the hidden threat. The curse could be the category itself, an entrenched habit, a competing brand\'s grip, or a circumstance that shadows everything.' },
          { label: 'The Fateful Moment', instruction: 'Show how the consumer fell into stasis — the moment they stopped reaching, stopped questioning, or were lulled into a numbing routine by an incumbent brand or category norm. This is the moment the curse took hold.' },
          { label: 'The Long Sleep', instruction: 'Describe the consumer\'s frozen state — accepting less, not realising what they\'re missing, the world changing around them while they remain still. The brand they need has not yet reached them.' },
          { label: 'The Awakening', instruction: 'The brand is the awakening force. Show how it breaks through — an encounter, a product experience, a message, or a moment of recognition that stirs the consumer back to life. Be specific about what the brand does that nothing else could.' },
          { label: 'The New Kingdom', instruction: 'Show the consumer\'s life after awakening — what is now possible, what the long sleep cost them, and what the brand\'s arrival makes real. The consumer is the one who is renewed; the brand is what made it possible.' },
        ],
      },
      {
        id: 'hansel-and-gretel',
        label: 'Hansel & Gretel',
        arc: 'fall-rise',
        arcDescription: 'Abandonment → deception → resourcefulness → escape',
        dualPOV: false,
        steps: [
          { label: 'Abandoned in the Woods', instruction: 'The CONSUMERS are Hansel and Gretel — vulnerable, underserved, or abandoned by a category that was supposed to help them. Show their specific situation: what they needed, who failed them, and the danger of navigating the market alone.' },
          { label: 'The Tempting House', instruction: 'A rival brand or category incumbent lures the consumer in with the appearance of safety, abundance, or care. Show how attractive and convincing the trap looks — the clever marketing, the too-good promises, the welcoming surface.' },
          { label: 'Captive', instruction: 'The consumer is caught — locked into a contract, a habit, a subscription, or a relationship with a brand that exploits rather than serves them. Show the specific manipulation and the apparent hopelessness of leaving.' },
          { label: 'The Clever Turn', instruction: 'Something shifts the power dynamic in the consumer\'s favour — information, an alternative that appears, a moment of clarity. This is where the brand being told either arrives as the key to escape OR is revealed as the captor they must outsmart.' },
          { label: 'The Oven', instruction: 'The consumer acts decisively to free themselves. If the brand is the hero, show how it arms the consumer to turn the table on the incumbent. If the brand is the villain, show the consumer using the brand\'s own tools against it to escape.' },
          { label: 'Home with Treasure', instruction: 'The consumer returns to safety, transformed by what they survived. Show what they gained — not just freedom but knowledge, confidence, and a new standard. What they carry home is the proof that the ordeal was worth it.' },
        ],
      },
      {
        id: 'beauty-and-beast',
        label: 'Beauty & the Beast',
        arc: 'rise-fall-rise',
        arcDescription: 'Appearances → deeper truth → transformation through love',
        dualPOV: true,
        steps: [
          { label: 'The Surface', instruction: 'The CONSUMER is Beauty — discerning, capable of seeing beyond appearances. The BRAND is the Beast — misunderstood, feared, or avoided by others. Round 1 tells this from the consumer\'s perspective; Round 2 from the brand\'s. Establish how both appear to the world and how appearances constrain each.' },
          { label: 'Forced Together', instruction: 'Show how the consumer encounters the brand despite their initial reluctance — the circumstances, the recommendation, or the necessity that brings them into contact. Show the consumer\'s wariness and the brand\'s intimidating or unfamiliar surface.' },
          { label: 'Behind the Mask', instruction: 'The consumer discovers something true about the brand that the surface obscures — a capability, a value, a depth of care. This is the moment of genuine surprise that changes the consumer\'s perception.' },
          { label: 'The Bond', instruction: 'Show the relationship deepening: what the brand gives the consumer that no other brand could, and what the consumer\'s engagement reveals about the brand\'s best self. The bond is mutual transformation.' },
          { label: 'The Breaking Point', instruction: 'A failure, a misunderstanding, or a competing offer threatens to end the relationship. Show what is at stake for the consumer — and what the brand risks losing — if they cannot find their way back to each other.' },
          { label: 'The Transformation', instruction: 'The relationship is restored and both are changed. The consumer is elevated by what the brand made possible; the brand is revealed in its fullest form. The transformation belongs to both — but the consumer\'s change is the story\'s heart.' },
        ],
      },
      {
        id: 'little-red-riding-hood',
        label: 'Little Red Riding Hood',
        arc: 'rise-fall-rise',
        arcDescription: 'Innocence → deception → danger → rescue/wisdom',
        dualPOV: true,
        steps: [
          { label: 'The Path Through the Woods', instruction: 'The CONSUMER is Little Red Riding Hood — on a clear mission, armed with good intentions, but navigating a marketplace full of risk. Round 1 follows the consumer; Round 2 reveals the competitor/antagonist\'s perspective. Establish the consumer\'s world: what they want, who they trust, and the warnings about the category they haven\'t fully taken to heart.' },
          { label: 'The Wolf in Disguise', instruction: 'A competitor, incumbent, or manipulative brand constructs a deceptive face — charming, helpful-seeming, wearing the language of care and value. Show specifically how the wolf (a competitor or category villain) disguises itself as something trustworthy to capture the consumer\'s attention.' },
          { label: 'Off the Path', instruction: 'The consumer is diverted — by a better-sounding promise, a convenience, a shiny offer. Show how the competitor pulls them away from the brand (or relationship) that actually serves them. The deception feels entirely reasonable at the time.' },
          { label: "The Grandmother's Cottage", instruction: 'The consumer arrives expecting what was promised and finds the threat fully revealed — the fine print, the poor experience, the manipulation exposed. Show the dawning recognition of how wrong this is.' },
          { label: 'The Teeth', instruction: 'The trap closes. Show how completely the consumer was deceived and what it costs them — time, money, trust, or something harder to measure. This is the competitor\'s true nature fully revealed.' },
          { label: 'Out of the Woods', instruction: 'The consumer escapes or is rescued — either by their own resourcefulness or by the brand that was always the safer path. Show what they have learned and how they will navigate the market differently. The brand\'s trustworthiness is vindicated by contrast.' },
        ],
      },
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    description: 'Competition, teamwork, and the pursuit of excellence under pressure',
    subtypes: [
      {
        id: 'underdog',
        label: 'The Underdog',
        arc: 'fall-rise',
        arcDescription: 'Dismissed → outmatched → belief → upset victory',
        dualPOV: false,
        steps: [
          { label: 'No One Believes', instruction: 'The CONSUMER is the underdog — overlooked, underestimated, or written off by the mainstream. Show their specific situation and the dominant force (a category incumbent, a competitor\'s consumer base, a cultural norm) that dismisses them. The brand has not yet appeared.' },
          { label: 'The Proving Ground', instruction: 'Show the consumer in early struggles — small wins, setbacks, the process of building belief. This is where the brand either enters as the training ground and resource, or stays absent while the consumer fights alone.' },
          { label: 'The Favourite Looms', instruction: 'The dominant competitor or incumbent is formidable. Show their dominance concretely — the resources, the reputation, the unfair advantage. The brand (as helper) must give the consumer something that closes this gap.' },
          { label: 'The Moment of Truth', instruction: 'The consumer reaches their crisis point. Show what the brand gives them — a capability, a confidence, a tool — that turns the tide. Or if the brand is the favourite, show the consumer finding the insight that exposes the giant\'s vulnerability.' },
          { label: 'The Upset', instruction: 'The consumer wins. Show their disbelief, the joy, the vindication. The brand\'s role in this victory is acknowledged — but the win belongs entirely to the consumer. What does this moment mean for who they now believe themselves to be?' },
        ],
      },
      {
        id: 'dynasty',
        label: 'The Dynasty',
        arc: 'rise-fall-rise',
        arcDescription: 'Dominance → complacency/challenge → renewal → legacy',
        dualPOV: false,
        steps: [
          { label: 'The Golden Era', instruction: 'The CONSUMER is the dynasty — at their peak, defined by consistent excellence. Show what their life, identity, or performance looked like at its best, and what brand or habit was part of that golden era.' },
          { label: 'The Cracks', instruction: 'Show the first signs of decline in the consumer\'s life — a shift in their situation, a category that no longer meets their needs, or complacency setting in. The brand that served them in the golden era may now be part of the problem.' },
          { label: 'The Fall', instruction: 'The consumer loses their edge — something fails, a better option they ignored takes hold, or the gap between who they were and who they are becomes undeniable. Show the reckoning fully.' },
          { label: 'Rebuilding the Identity', instruction: 'The consumer does the hard work of renewal. This is where the brand enters as a genuine partner in rebuilding — not nostalgia, but a real tool for a new standard. Show what the brand offers that is different from before.' },
          { label: 'The Legacy Run', instruction: 'The consumer\'s comeback — not just to where they were but to something larger. Show what the brand makes possible in this new chapter and what legacy the consumer is now building. The dynasty is renewed on better terms.' },
        ],
      },
      {
        id: 'redemption',
        label: 'The Redemption Arc',
        arc: 'fall-rise',
        arcDescription: 'Failure/disgrace → exile → reckoning → return',
        dualPOV: false,
        steps: [
          { label: 'The Fall from Grace', instruction: 'The CONSUMER is the athlete seeking redemption. Establish their prior greatness — what they achieved, what they stood for — then show the failure: the moment they lost their way, made a mistake, or were beaten by circumstances. The brand they previously relied on may have been part of the fall.' },
          { label: 'The Wilderness', instruction: 'Show the consumer away from their best self — the doubt, the reduced circumstances, the slow rebuilding. This is often the period before the brand, or a period with the wrong brand. Show what is missing.' },
          { label: 'The Decision to Return', instruction: 'The consumer makes the internal choice to try again. This is often the moment the brand enters — not as a rescue but as the resource the consumer chooses when they are ready to do the work. Show what specifically re-ignites their belief.' },
          { label: 'Proving It Again', instruction: 'The consumer returns to their arena — the market, the challenge, the standard they once met. Show the scrutiny, the doubters, and the moments where the old capability flickers. The brand is present as consistent support, not as the performer.' },
          { label: 'The Redemption', instruction: 'The consumer achieves something that settles the question. Not just a return to form — a statement of who they now are. Show what this means in the full context of what they lost and regained. The brand enabled it; the consumer earned it.' },
        ],
      },
      {
        id: 'rivalry',
        label: 'The Rivalry',
        arc: 'rise-fall-rise',
        arcDescription: 'Two giants defined by each other → collision → mutual elevation',
        dualPOV: true,
        steps: [
          { label: 'The Two Worlds', instruction: 'The CONSUMER is one competitor — a person or cohort defined by how they use (or are defined by) the brand. The rival brand\'s consumer is the other. Round 1 follows our consumer; Round 2 follows the rival\'s. Establish both worlds separately: their values, their performance, their identity, and what drives them.' },
          { label: 'The First Meeting', instruction: 'Show the moment these two consumer worlds first collide — a category contest, a cultural moment, or a head-to-head comparison. Who came out ahead, and what did each recognise in the other? This is the moment the rivalry between their brands becomes personal.' },
          { label: 'Defined by the Other', instruction: 'Show how each consumer has been shaped by the rival\'s existence — how competing loyalties have pushed both to higher standards, stronger identities, and sharper choices. The brands are elevated by what their consumers demand of them.' },
          { label: 'The Defining Contest', instruction: 'The moment that feels like it will settle everything — a product launch, a cultural shift, a performance comparison. Show the intensity from the consumer\'s perspective: the doubt, the swings, what they stand to win or lose.' },
          { label: 'What the Rivalry Made Them', instruction: 'After the contest, show what each consumer has become because of the rivalry. The competition ends or changes — but what it added to both consumers (and both brands) is permanent. The consumer is elevated by having had a worthy rival.' },
        ],
      },
    ],
  },
  {
    id: 'battles',
    label: 'Battles',
    description: 'Conflict, strategy, and the cost of victory and defeat',
    subtypes: [
      {
        id: 'david-goliath',
        label: 'David vs Goliath',
        arc: 'fall-rise',
        arcDescription: 'Overwhelming force vs. agility and belief',
        dualPOV: false,
        steps: [
          { label: 'The Giant Advances', instruction: 'The CONSUMER is David. The giant is the dominant force bearing down on them — an incumbent brand, an entrenched system, a category behemoth. Show the overwhelming scale of what the consumer faces and why everyone believes it cannot be beaten.' },
          { label: 'The Small Defender', instruction: 'Show the consumer\'s real position: small, unlikely, dismissed — but possessing something the giant lacks. Speed, belief, a different kind of intelligence, or a need that the giant cannot serve. The brand being told is either the sling in David\'s hand (helper) or the giant itself (villain/incumbent to topple).' },
          { label: 'The Terms of Battle', instruction: 'The consumer refuses to compete on the giant\'s terms. Show how they choose their ground — the approach, the moment, the specific advantage — that negates the size disparity. The brand (as helper) makes this possible; or (as the giant) is what the consumer has learned to outmanoeuvre.' },
          { label: 'The Stone in the Air', instruction: 'The consumer\'s decisive action — fast, precise, and completely unexpected. This is the moment the brand either arms the consumer for maximum impact or (if the brand is the giant) the moment it is exposed to a strike it never saw coming.' },
          { label: 'What Falls', instruction: 'The giant falls. Show the aftermath — the shock, the shift in the consumer\'s world, what is now possible that wasn\'t before. The consumer\'s victory redefines the category. The brand\'s role in that shift is acknowledged.' },
        ],
      },
      {
        id: 'siege',
        label: 'The Siege',
        arc: 'fall-rise',
        arcDescription: 'Surrounded and starved → endurance → breakthrough',
        dualPOV: false,
        steps: [
          { label: 'The Walls Go Up', instruction: 'The CONSUMER is under siege — cut off, locked in, or surrounded by forces that drain their resources and choices. The besieging force could be an incumbent brand, a category lock-in, a financial trap, or a market with no good options. Show what the consumer has lost access to and how trapped they feel.' },
          { label: 'Holding On', instruction: 'Show the cost of endurance — what the consumer does to keep going without what they need. Show the discipline it takes and who or what nearly breaks them. The brand has not yet arrived, or its absence is part of the siege.' },
          { label: 'The Tunnel', instruction: 'A hidden route appears — not a direct assault but an unexpected way through. This is where the brand enters, or where the consumer discovers something that negates the besieging force\'s advantage. Show the specific insight or product capability that changes everything.' },
          { label: 'The Breakout', instruction: 'The consumer acts. Show the risk taken, the moment of maximum danger, and the cost of getting through. The brand is either the vehicle of escape or the guide that makes the breakout possible.' },
          { label: 'After the Siege', instruction: 'Show what the consumer has become through the ordeal. Victory, but changed — what was rebuilt, what was permanently lost, and what the brand now means to someone who has survived that level of pressure.' },
        ],
      },
      {
        id: 'trojan-horse',
        label: 'The Trojan Horse',
        arc: 'rise-fall',
        arcDescription: 'Apparent victory → hidden threat → catastrophic reversal',
        dualPOV: true,
        steps: [
          { label: 'The Stalemate', instruction: 'The CONSUMER is the defender — holding their position, their loyalty, their habits against a category they can\'t quite break free of. Round 1 is from the consumer\'s perspective; Round 2 reveals the rival brand\'s strategy. Show the deadlock: the consumer and the incumbent brand each holding ground, both exhausted, neither winning.' },
          { label: 'The Gift', instruction: 'A rival brand (or the brand being told, depending on perspective) offers something that looks like pure value — a free tier, a promotion, a compelling feature, a too-good deal. Show the deceptive offering in full: what it looks like on the surface and what it actually carries inside.' },
          { label: 'The Debate', instruction: 'Show the consumer\'s moment of decision — the internal debate, the warnings from people who have been here before, the voice of caution they choose not to hear. Show how the desire for an easy answer wins over the harder wisdom.' },
          { label: 'The Gates Open', instruction: 'The consumer brings the gift inside — downloads the app, signs the contract, switches allegiance. Show them at their most relaxed and open, unaware of what is about to change.' },
          { label: 'The Fire Inside', instruction: 'The hidden payload activates — the data harvested, the price hike after lock-in, the feature removed, the trust violated. Show the reversal from the consumer\'s perspective: total, sudden, and devastating. The brand being told is either the force that exploited them or the one they wish they had chosen instead.' },
        ],
      },
      {
        id: 'last-stand',
        label: 'The Last Stand',
        arc: 'fall',
        arcDescription: 'Outnumbered → defiant resistance → defeat with honour',
        dualPOV: false,
        steps: [
          { label: 'The Retreat Ends Here', instruction: 'The CONSUMER is the one making the last stand — choosing to stop retreating from a dominant force: a category shift, an overpowering competitor, or a world that no longer supports what they value. Show what they are defending and why it matters more than survival. The brand either stands with them or is the overwhelming force they are resisting.' },
          { label: 'Who Stands With Them', instruction: 'Show the small group — the community, the tribe, the loyal users — who choose to remain. What binds them? What are they defending together? This is where the brand\'s community becomes visible as a real force, not just a market segment.' },
          { label: 'The First Wave', instruction: 'The pressure begins. Show the early losses, the heroism, and the growing realisation of what the consumer is truly up against. The brand (as defender) absorbs costs to protect its consumers; or (as the overwhelming force) shows its true scale.' },
          { label: 'Holding the Line', instruction: 'Show the consumer\'s courage of endurance — choosing meaning over convenience, standing for something when retreat would be easier and more rational. The brand\'s values are proved here under maximum pressure.' },
          { label: 'What the Stand Became', instruction: 'Show the aftermath. Defeat, perhaps — but the kind that changes something. What did the consumer\'s stand mean to those who came after? The brand that stood with them is remembered differently because of this. Honourable defeat can redefine a brand\'s meaning more than easy victory.' },
        ],
      },
    ],
  },
  {
    id: 'heros-journey',
    label: "Hero's Journey",
    description: "Campbell's monomyth — the universal structure of transformation through ordeal",
    subtypes: [
      {
        id: 'classic-hero',
        label: 'The Classic Hero',
        arc: 'rise-fall-rise',
        arcDescription: 'Call → threshold → ordeal → return transformed',
        dualPOV: false,
        steps: [
          { label: 'The Ordinary World', instruction: 'The CONSUMER is the hero. Show them in their everyday life — comfortable, limited, or quietly restless. Show what is missing from their world and what they stand to lose if nothing changes. The brand has not yet appeared.' },
          { label: 'The Call to Adventure', instruction: 'Something disrupts the consumer\'s ordinary world — a need, a crisis, a discovery, or a glimpse of what could be. This may be the moment the brand first appears. Show the consumer\'s initial hesitation or refusal.' },
          { label: 'Crossing the Threshold', instruction: 'The consumer commits. They engage with the brand, take the leap, or step into the unfamiliar. Show the point of no return — what they leave behind and what they carry with them into the new world the brand offers.' },
          { label: 'Trials and Allies', instruction: 'Show the tests and challenges the consumer faces in their journey with the brand. The brand is the ally — the mentor, the tool, the guide — but the consumer is the one being tested. Each trial reveals something about who they are becoming.' },
          { label: 'The Ordeal', instruction: 'The supreme test — the consumer faces their greatest challenge, fear, or the thing they cannot achieve without fundamentally changing. The brand is present but cannot do this for them. Show the transformation that happens at the crisis point.' },
          { label: 'The Road Back', instruction: 'The consumer begins the return, carrying what they won. Show what must still be resolved — what the brand must deliver, what the consumer must prove — before the journey is complete.' },
          { label: 'The Return', instruction: 'The consumer brings their gift back to their world — changed, capable, or wise in a way they weren\'t before. Show what is different in them, in their life, and in what is now possible. The brand enabled this journey; the consumer completed it.' },
        ],
      },
    ],
  },
  {
    id: 'values-based',
    label: 'Values Based',
    description: "Wirthin Perception Bridge — from product attributes to human terminal values",
    subtypes: [
      {
        id: 'perception-bridge',
        label: 'Perception Bridge',
        arc: 'rise',
        arcDescription: 'Attributes → functional benefits → emotional benefits → terminal values',
        dualPOV: false,
        steps: [
          {
            label: 'The Attribute',
            instruction: 'Start with a concrete, observable product or brand attribute — a feature, a material, a process, a specification. Keep it tangible and specific. This is where the brand lives; the CONSUMER is the one who encounters it.',
          },
          {
            label: 'Functional Benefit',
            instruction: 'Translate the attribute into what it does FOR THE CONSUMER: the practical outcome in their life, the problem solved, the performance delivered. The consumer asks "so what does that mean for me?" — answer it from their perspective.',
          },
          {
            label: 'Emotional Benefit',
            instruction: 'Go deeper into the CONSUMER\'s experience: what does the functional benefit make them feel? Show the emotional payoff — confidence, relief, pride, connection, freedom. The consumer is the one feeling this; the brand is what made it possible.',
          },
          {
            label: 'Terminal Value',
            instruction: 'Reach the CONSUMER\'s deepest human motivation: the fundamental value this connects to — security, belonging, achievement, self-expression, legacy, peace of mind. Show why this brand ultimately matters to who the consumer wants to be, not what the brand wants to be.',
          },
          {
            label: 'The Narrative Bridge',
            instruction: 'Weave the four levels into a single, cohesive story told from the CONSUMER\'S perspective — their encounter with the attribute, the practical change it makes in their life, the feeling it unlocks, and the deeper human truth it serves. The brand is the constant enabler; the consumer is the one whose life is being described. The bridge should feel inevitable, not constructed.',
          },
        ],
      },
    ],
  },
];

export function getStoryCategory(id: string): StoryCategory | undefined {
  return STORY_CATEGORIES.find(c => c.id === id);
}

export function getStorySubtype(categoryId: string, subtypeId: string): StorySubtype | undefined {
  return getStoryCategory(categoryId)?.subtypes.find(s => s.id === subtypeId);
}
