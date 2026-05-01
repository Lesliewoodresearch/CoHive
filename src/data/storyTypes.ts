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
          { label: 'Ordinary World', instruction: 'Show the protagonist in their humble, constrained everyday situation. Establish the unfairness or limitation they face.' },
          { label: 'The Hardship', instruction: 'Introduce the obstacle, rival, or oppressive force that deepens the struggle and makes the situation feel impossible.' },
          { label: 'The Helper / Magic', instruction: 'Bring in an unexpected enabler — a mentor, tool, insight, or lucky break — that gives the protagonist what they need to compete.' },
          { label: 'The Ball / Moment of Possibility', instruction: 'Place the protagonist in the elevated world they aspire to. Show them thriving, recognised, or desired against all expectation.' },
          { label: 'The Stroke of Midnight', instruction: 'Introduce the threat of reversal — the window closing, the truth threatening to emerge, the clock running out.' },
          { label: 'The Glass Slipper', instruction: 'Deliver the proof of identity and the lasting transformation. The protagonist is permanently elevated; the rival is exposed or diminished.' },
        ],
      },
      {
        id: 'ugly-duckling',
        label: 'Ugly Duckling',
        arc: 'fall-rise',
        arcDescription: 'Rejection → isolation → self-discovery → belonging',
        dualPOV: false,
        steps: [
          { label: 'Misfit in the Flock', instruction: 'Establish the protagonist as different, mocked, or excluded from the group that should accept them. Make the rejection feel unjust.' },
          { label: 'Wandering Alone', instruction: 'Show the journey through isolation and failure as the protagonist tries and fails to find a place to belong.' },
          { label: 'Glimpse of the True Self', instruction: "Offer a moment where the protagonist's real nature is hinted at — a small act of grace, beauty, or strength that surprises even them." },
          { label: 'Finding the Swans', instruction: 'The protagonist encounters those who are truly like them and is welcomed without condition. The transformation becomes undeniable.' },
          { label: 'The Reflection', instruction: 'The protagonist sees themselves clearly for the first time. What they thought was a flaw was the mark of who they truly are.' },
        ],
      },
      {
        id: 'sleeping-beauty',
        label: 'Sleeping Beauty',
        arc: 'rise-fall-rise',
        arcDescription: 'Promise → curse/stasis → awakening → renewal',
        dualPOV: false,
        steps: [
          { label: 'The Gift and the Curse', instruction: 'Establish great promise — gifts, potential, or a golden beginning — alongside a hidden threat or prophecy that shadows it.' },
          { label: 'The Fateful Moment', instruction: 'The protagonist encounters the forbidden thing and the curse is triggered. Show the moment of transgression or bad luck.' },
          { label: 'The Long Sleep', instruction: 'Describe the stasis — the frozen state, the missed time, the world paused or changed while the protagonist is absent.' },
          { label: 'The Awakening', instruction: 'Something — a catalyst, a person, an idea — breaks through. The protagonist stirs. What wakes them and how does the world look now?' },
          { label: 'The New Kingdom', instruction: 'Show life after the sleep: what has been lost, what has been preserved, and what new beginning is possible.' },
        ],
      },
      {
        id: 'hansel-and-gretel',
        label: 'Hansel & Gretel',
        arc: 'fall-rise',
        arcDescription: 'Abandonment → deception → resourcefulness → escape',
        dualPOV: false,
        steps: [
          { label: 'Abandoned in the Woods', instruction: 'The protagonists are cast out or left without protection by those who should care for them. Establish their vulnerability and the danger of the world around them.' },
          { label: 'The Tempting House', instruction: 'Introduce something that looks like safety, abundance, or rescue but conceals a trap. Show the protagonists being lured in.' },
          { label: 'Captive', instruction: 'The protagonists are caught. Describe the confinement, manipulation, or exploitation they face and the apparent hopelessness of escape.' },
          { label: 'The Clever Turn', instruction: 'One of the protagonists finds an insight or piece of information that changes the power dynamic. Show the plan forming.' },
          { label: 'The Oven', instruction: 'The protagonists act decisively, turning the trap back on the captor. The moment of reversal and the cost it carries.' },
          { label: 'Home with Treasure', instruction: 'Return home transformed — the danger defeated, something valuable gained, and the relationship between the protagonists changed.' },
        ],
      },
      {
        id: 'beauty-and-beast',
        label: 'Beauty & the Beast',
        arc: 'rise-fall-rise',
        arcDescription: 'Appearances → deeper truth → transformation through love',
        dualPOV: true,
        steps: [
          { label: 'The Surface', instruction: 'Establish how each character appears to the world — the beauty that others see and the beast that others fear or avoid. Show how appearances constrain both.' },
          { label: 'Forced Together', instruction: 'Bring the two together against their will or expectation. Show the initial resistance, fear, or contempt on both sides.' },
          { label: 'Behind the Mask', instruction: 'Reveal something true about each character that the surface obscures. A moment of vulnerability, kindness, or depth that surprises the other.' },
          { label: 'The Bond', instruction: 'Show the relationship deepening against all expectation. What do they each give the other that no one else could?' },
          { label: 'The Breaking Point', instruction: 'A misunderstanding, separation, or threat tears them apart. Show the stakes: what is lost if they cannot find their way back.' },
          { label: 'The Transformation', instruction: 'Love or understanding completes the change. Both characters are transformed — not just the beast. Show what each becomes.' },
        ],
      },
      {
        id: 'little-red-riding-hood',
        label: 'Little Red Riding Hood',
        arc: 'rise-fall-rise',
        arcDescription: 'Innocence → deception → danger → rescue/wisdom',
        dualPOV: true,
        steps: [
          { label: 'The Path Through the Woods', instruction: "Establish the protagonist's world: the trusted relationships, the mission, and the warnings they have been given but do not fully heed." },
          { label: 'The Wolf in Disguise', instruction: 'Introduce the antagonist — charming, persuasive, wearing a trusted face. Show the deception being constructed.' },
          { label: 'Off the Path', instruction: 'The protagonist is diverted. Show how curiosity, trust, or naivety leads them away from safety.' },
          { label: "The Grandmother's Cottage", instruction: 'The protagonist arrives expecting safety and finds the threat fully revealed. Show the dawning recognition that something is terribly wrong.' },
          { label: 'The Teeth', instruction: "The danger is explicit. The trap closes. Show the protagonist's realisation of how completely they were deceived." },
          { label: 'Out of the Woods', instruction: 'Resolution — rescue, escape, or hard-won survival. What has the protagonist learned and how will they walk through the woods differently now?' },
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
          { label: 'No One Believes', instruction: 'Establish the team or athlete as overlooked, underfunded, or dismissed. Show the gap between them and the favourite in concrete terms.' },
          { label: 'The Proving Ground', instruction: 'Show early rounds or preparation — small wins that build belief, setbacks that test resolve, the team learning who they are.' },
          { label: 'The Favourite Looms', instruction: 'The opponent is formidable. Show their dominance and the odds — make the gap feel real and the outcome improbable.' },
          { label: 'The Moment of Truth', instruction: 'The contest reaches its crisis point. Show the underdog finding something — belief, a tactical edge, sheer will — that turns the tide.' },
          { label: 'The Upset', instruction: 'Victory arrives. Show the disbelief, the joy, the vindication. What does this win mean beyond the scoreboard?' },
        ],
      },
      {
        id: 'dynasty',
        label: 'The Dynasty',
        arc: 'rise-fall-rise',
        arcDescription: 'Dominance → complacency/challenge → renewal → legacy',
        dualPOV: false,
        steps: [
          { label: 'The Golden Era', instruction: 'Establish the dynasty at its peak — the culture, the talent, the records. Show what made them unbeatable.' },
          { label: 'The Cracks', instruction: 'Introduce the first signs of decline — age, complacency, internal friction, or a rising challenger. Show the warning signs being ignored.' },
          { label: 'The Fall', instruction: 'The dynasty is beaten. Show the loss in full — the disbelief, the reckoning, the questions about whether it can ever be rebuilt.' },
          { label: 'Rebuilding the Identity', instruction: 'The hard work of renewal. New players, new ideas, a return to first principles, or a reinvention of what the team stands for.' },
          { label: 'The Legacy Run', instruction: "The comeback — not just to winning but to something larger. How does this team's story redefine what a dynasty can be?" },
        ],
      },
      {
        id: 'redemption',
        label: 'The Redemption Arc',
        arc: 'fall-rise',
        arcDescription: 'Failure/disgrace → exile → reckoning → return',
        dualPOV: false,
        steps: [
          { label: 'The Fall from Grace', instruction: "Establish the athlete's prior greatness, then show the failure — injury, mistake, scandal, or collapse — that cost them everything." },
          { label: 'The Wilderness', instruction: 'Show the years away from the spotlight — the doubt, the effort, the setbacks, and the slow rebuilding of body, mind, or reputation.' },
          { label: 'The Decision to Return', instruction: 'What makes them come back? Show the internal shift — the moment they choose to try again when staying away would be easier.' },
          { label: 'Proving It Again', instruction: 'The return to competition. Show the scrutiny, the doubters, and the moments where the old greatness flickers and nearly fails.' },
          { label: 'The Redemption', instruction: 'The performance that settles it. Not just a win — a statement. Show what this achievement means in the context of everything that came before.' },
        ],
      },
      {
        id: 'rivalry',
        label: 'The Rivalry',
        arc: 'rise-fall-rise',
        arcDescription: 'Two giants defined by each other → collision → mutual elevation',
        dualPOV: true,
        steps: [
          { label: 'The Two Worlds', instruction: 'Establish both competitors separately — their styles, their drives, their paths to greatness. Show how different they are.' },
          { label: 'The First Meeting', instruction: 'Show the initial collision — who won, who lost, and what each recognised in the other. The moment the rivalry is born.' },
          { label: 'Defined by the Other', instruction: 'Show how each competitor has been shaped, motivated, or tormented by the existence of the other. They push each other to heights neither would reach alone.' },
          { label: 'The Defining Contest', instruction: 'The match, race, or fight that feels like it will settle everything. Show the intensity, the swings, the moments of doubt.' },
          { label: 'What the Rivalry Made Them', instruction: 'After the contest, show what each has become. The rivalry ends or changes — what did it add to the sport and to both of them?' },
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
          { label: 'The Giant Advances', instruction: 'Establish the overwhelming force — size, resources, reputation, or power. Show the fear it inspires and why everyone believes it cannot be beaten.' },
          { label: 'The Small Defender', instruction: 'Introduce the challenger — small, unlikely, dismissed. Show what they have that the giant does not: speed, belief, a different kind of intelligence.' },
          { label: 'The Terms of Battle', instruction: "Show how the small challenger refuses to fight on the giant's terms and chooses the terrain, weapon, or approach that negates the size advantage." },
          { label: 'The Stone in the Air', instruction: 'The decisive moment — fast, precise, unexpected. Show the one action that changes everything.' },
          { label: 'What Falls', instruction: 'The giant falls. Show the aftermath — the shock, the shift in power, and what the world looks like now that the unbeatable has been beaten.' },
        ],
      },
      {
        id: 'siege',
        label: 'The Siege',
        arc: 'fall-rise',
        arcDescription: 'Surrounded and starved → endurance → breakthrough',
        dualPOV: false,
        steps: [
          { label: 'The Walls Go Up', instruction: 'Establish the siege — the protagonist is cut off, surrounded, or trapped. Show the resources running low and the outside world feeling impossibly far.' },
          { label: 'Holding On', instruction: 'Show the discipline and cost of endurance. Who breaks? Who holds? What does it take to keep going when relief seems impossible?' },
          { label: 'The Tunnel', instruction: 'A way through is found — not a direct assault but a clever, hidden, or unexpected route that the besiegers didn\'t anticipate.' },
          { label: 'The Breakout', instruction: 'Show the decisive action — the risk taken, the moment of maximum danger, and the cost of getting out.' },
          { label: 'After the Siege', instruction: 'Show what survival has made of those who endured. Victory, but changed — what is rebuilt and what is permanently gone?' },
        ],
      },
      {
        id: 'trojan-horse',
        label: 'The Trojan Horse',
        arc: 'rise-fall',
        arcDescription: 'Apparent victory → hidden threat → catastrophic reversal',
        dualPOV: true,
        steps: [
          { label: 'The Stalemate', instruction: 'Establish the deadlock — two sides unable to defeat each other by force. Show the exhaustion, the wasted resources, and the desperation for a solution.' },
          { label: 'The Gift', instruction: 'Introduce the deceptive offering — something that looks like concession, generosity, or retreat but carries a hidden payload.' },
          { label: 'The Debate', instruction: 'Show the moment of decision: the warnings ignored, the voices of caution drowned out, the choice to believe what is convenient.' },
          { label: 'The Gates Open', instruction: 'The gift is accepted and brought inside. Show the defenders at their most relaxed — celebrating, sleeping, off guard.' },
          { label: 'The Fire Inside', instruction: 'The hidden threat activates. Show the reversal — total, sudden, and devastating to those who trusted the gift.' },
        ],
      },
      {
        id: 'last-stand',
        label: 'The Last Stand',
        arc: 'fall',
        arcDescription: 'Outnumbered → defiant resistance → defeat with honour',
        dualPOV: false,
        steps: [
          { label: 'The Retreat Ends Here', instruction: 'Establish the moment the protagonist chooses to stop retreating. Show the impossible odds and why staying and fighting matters more than surviving.' },
          { label: 'Who Stands With Them', instruction: 'Show the small group that chooses to remain. What binds them? What are they defending? Show the relationship between them.' },
          { label: 'The First Wave', instruction: 'The battle begins. Show early heroism, losses, and the gradual realisation of the scale of what they face.' },
          { label: 'Holding the Line', instruction: 'Show the courage of endurance — fighting when retreat would be rational, choosing meaning over survival.' },
          { label: 'What the Stand Became', instruction: 'Show the aftermath — what the last stand meant to those who came after. Defeat, but the kind that changes history.' },
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
          { label: 'The Ordinary World', instruction: 'Establish the hero in their everyday life — comfortable, limited, or restless. Show what they stand to lose and what is missing.' },
          { label: 'The Call to Adventure', instruction: "Something disrupts the ordinary world — an invitation, a crisis, a discovery. Show the hero's initial refusal or hesitation." },
          { label: 'Crossing the Threshold', instruction: 'The hero commits. They leave the familiar world behind. Show the point of no return and what they carry with them.' },
          { label: 'Trials and Allies', instruction: "Show the tests, enemies, and helpers encountered in the new world. Each trial reveals something about the hero's true character." },
          { label: 'The Ordeal', instruction: 'The supreme test — the hero faces death (literal or symbolic), their greatest fear, or the thing they cannot defeat without changing. Show the transformation.' },
          { label: 'The Road Back', instruction: 'The hero begins the return. They carry the reward but the journey is not over — show what must still be resolved before they can go home.' },
          { label: 'The Return', instruction: 'The hero brings their gift back to the ordinary world. Show what has changed — in them, in the world, and in what is now possible.' },
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
            instruction: 'Start with a concrete, observable product or brand attribute — a feature, a material, a process, a specification. Keep it tangible and specific.',
          },
          {
            label: 'Functional Benefit',
            instruction: 'Translate the attribute into what it does for the person: the practical outcome, the problem solved, the performance delivered. Answer "so what does that mean for me?"',
          },
          {
            label: 'Emotional Benefit',
            instruction: 'Go deeper: what does the functional benefit make the person feel? Show the emotional payoff — confidence, relief, pride, connection, freedom. The feeling the product enables.',
          },
          {
            label: 'Terminal Value',
            instruction: 'Reach the deepest human motivation: the fundamental value this connects to — security, belonging, achievement, self-expression, legacy, peace of mind. Show why this product ultimately matters to who the person wants to be.',
          },
          {
            label: 'The Narrative Bridge',
            instruction: 'Weave the four levels into a single, cohesive story that moves naturally from the physical product to the human truth it serves. The bridge should feel inevitable, not constructed.',
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
