## 1. Overall App Flow

```mermaid flowchart TD
    A([Start — Browser]) --> B[/Open CoHive URL/]
    B --> C{Logged in?}
    C -- No --> D[Login Screen]
    D --> E[/Enter email + password/]
    E --> F{Valid credentials?}
    F -- No --> E
    F -- Yes --> G[Set localStorage cohive_logged_in]
    C -- Yes --> H
    G --> H

    H{Databricks\nauthenticated?} -- No --> I[DatabricksOAuthLogin modal]
    I --> J[OAuth token exchange]
    J --> K[Store session in localStorage]
    K --> L
    H -- Yes --> L

    L[ProcessWireframe — Main App]
    L --> M[/Select hex from workflow ring/]
    M --> N[Hex View]
```

## 2. Hexagonal Workflow Ring

```mermaid flowchart LR
    Enter([Enter\nBegin Project]) --> Research
    Research([Research\nKnowledge Assets]) --> Personas

    subgraph Personas [Persona Hexes]
        direction TB
        Luminaries([Luminaries])
        Consumers([Consumers])
        Colleagues([Colleagues])
        Cultural([Cultural])
        Panelist([Panelist\nfuture])
        Social([Social\nfuture])

    Personas --> Wisdom([Wisdom])
    Wisdom --> Grade([Grade\nSegment Testing])
    Grade --> Findings([Findings])
    Findings --> Review([Review])

    Enter -.->|brand + project\ntype set here| Research
    Enter -.->|filename\nauto-increments| Findings
```

## 3. Enter Hex — Project Initialisation

```mermaid flowchart TD
    A([Enter Hex]) --> B[/Input: Brand name/]
    B --> C[/Input: Project Type/]
    C --> D{Project type\nin system list?}
    D -- Yes --> E[Load system prompt template]
    D -- No --> F[Fetch custom config from Databricks]
    F --> E
    E --> G[/Auto-generate filename\nBrand_Type_YYYY-MM-DD_V1/]
    G --> H{Filename already\nsaved?}
    H -- Yes --> I[Bump version\ne.g. V2 V3]
    H -- No --> J[Use V1]
    I --> K
    J --> K
    K[/Select Research Files from KB/]
    K --> L[/Select Ideas Source\nGet Inspired or Load Ideas/]
    L --> M[Ready to run assessments]
```

## 4. Assessment Modal Flow

```mermaid flowchart TD
    A([Open Assessment Modal]) --> B{Default KB mode\n& scope set?}
    B -- No --> C[Show Settings Panel]
    C --> D[/User selects KB Mode\nScope · Model/]
    D --> E[Run Assessment]
    B -- Yes --> E

    E --> F[POST to api/databricks/assessment/run]
    F --> G[SSE stream opens]

    G --> H{SSE event type?}

    H -- round --> I[\Round content received\]
    I --> J[Add tab to tab bar]
    J --> K{First round?}
    K -- Yes --> L[Auto-select tab\nUser starts reading]
    K -- No --> M[Tab added silently\nSpinner shows in bar]
    L --> H
    M --> H

    H -- complete --> N[Set isComplete]
    N --> O{Summary\ngenerated?}
    O -- Yes --> P[Add Summary tab\nwith green dot]
    O -- No --> Q
    P --> Q

    Q[Show Accept & Close button]
    Q --> R[/User reads tabs\nat own pace/]
    R --> S[User clicks Accept & Close]
    S --> T{Any gems · checks\nor coal saved?}
    T -- Yes --> U[GemCheckCoal Review Panel]
    T -- No --> V[Close modal]
    U --> W[/User ranks &\nconfirms items/]
    W --> X[onReviewConfirmed callback]
    X --> Y[Batch add to User Notes\n+ update iterationChecks/Coal]
    Y --> V
```

## 5. Wisdom Hex — Input Methods

```mermaid flowchart TD
    A([Wisdom Hex]) --> B[/Select Input Method/]

    B --> C{Which method?}
    C -- Type/Paste --> D[/Enter text in textarea/]
    D --> D2[/Select insight type\nBrand · Category · General/]
    D2 --> SAVE

    C -- Voice Recording --> E{Mic available?}
    E -- No --> E1[Show error message]
    E -- Yes --> E2[Request microphone permission\nonly on click]
    E2 --> E3[Start MediaRecorder]
    E3 --> E4[/User speaks — recording in progress/]
    E4 --> E5[Stop recording]
    E5 --> E6[POST audio to Databricks transcription]
    E6 --> E7[\Transcript returned\]
    E7 --> SAVE

    C -- AI Interview --> F[Open InterviewDialog]
    F --> F2[/Multi-turn conversation\nwith AI interviewer/]
    F2 --> F3[Save transcript to KB]
    F3 --> DONE

    C -- Take Photo --> G{Camera available?}
    G -- No --> G1[Show error message]
    G -- Yes --> G2[Request camera permission\nonly on click]
    G2 --> G3[Show live camera preview]
    G3 --> G4[/User frames shot/]
    G4 --> G5[Capture frame via canvas.toBlob]
    G5 --> G6{Blob captured?}
    G6 -- No --> G7[Show error message]
    G6 -- Yes --> G8[wisdom_Photo_email_mmYY.jpg]
    G8 --> SAVE

    C -- Upload Video --> H[/Select video file\nmax 3.4 MB/]
    H --> H2{File within\nsize limit?}
    H2 -- No --> H3[Show error — too large]
    H2 -- Yes --> SAVE

    SAVE[Upload file to Databricks KB\nuploadToKnowledgeBase]
    SAVE --> DONE

    DONE([Show success message\nFile saved to KB])
```

## 6. Gem / Check / Coal — Saving Elements

```mermaid flowchart TD
    A([Assessment Modal — isComplete]) --> B[/User selects text\nby highlighting/]
    B --> C{Selection\n≥ 10 chars?}
    C -- No --> B
    C -- Yes --> D[Floating action buttons appear\nbelow highlighted text]

    D --> E{User clicks which?}

    E -- Gem 💎 --> F[POST saveGem to Databricks KB]
    F --> G{Save successful?}
    G -- No --> G1[Show error alert]
    G -- Yes --> H[onGemSaved callback]
    H --> I[Add to iterationGems\nfor AI context]
    I --> J[Show toast 3.5s]

    E -- Check ✓ --> K[Save to localStorage cohive_checks]
    K --> L[Show check toast]

    E -- Coal 🪨 --> M[Save to localStorage cohive_coal]
    M --> N[Show coal toast]

    J --> CONTINUE
    L --> CONTINUE
    N --> CONTINUE
    CONTINUE([User continues reading\nother tabs])

    CONTINUE --> O[User clicks Accept & Close]
    O --> P[Build ReviewItem list\nfrom saved gems · checks · coal]
    P --> Q{Any items?}
    Q -- No --> CLOSE
    Q -- Yes --> R[GemCheckCoal Review Panel opens]
    R --> S[/User includes · excludes · reorders/]
    S --> T[/User confirms/]
    T --> U[onReviewConfirmed fires]
    U --> V[Add entries to User Notes timeline\nGem = yellow · Check = green · Coal = dark]
    V --> W[Update iterationChecks + iterationCoal\nfor iteration save]
    W --> CLOSE([Modal closed])
```

## 7. User Notes — Structured Timeline

```mermaid flowchart TD
    A([User Notes Box\nright sidebar]) --> B{Entry type?}

    B -- User types --> C[/Note entry — plain text\nany time/]
    C --> D[Auto-resizing textarea\nno border]

    B -- Add Direction/Focus --> E[\Prompt entry added\nautomatically/]
    E --> F[Blue badge\n→ Direction · hex · run N]
    F --> G[New empty note entry\ncreated below]

    B -- Accept & Close modal --> H[onReviewConfirmed\nbatch insert]
    H --> I{Item type?}
    I -- Gem --> J[Yellow badge with\nhex gem icon]
    I -- Check --> K[Green badge\n✓ Check]
    I -- Coal --> L[Dark badge\n🪨 Coal]
    J --> M
    K --> M
    L --> M
    M[New empty note entry\ncreated below]

    subgraph Checkboxes [Progressive Visibility Checkboxes]
        N1[Notes — appears when\nuser has typed text]
        N2[Gems — appears when\nfirst gem/check/coal added]
        N3[Prompts — appears when\nfirst direction added]
    end

    subgraph Save [Iteration Save]
        S1[All entries written\nto USER NOTES section]
        S2[Checkbox state does NOT\naffect what is saved]
    end

    A --> Checkboxes
    A --> Save
```

## 8. Findings — Save Iteration

```mermaid flowchart TD
    A([Findings Hex]) --> B{Any hex\nexecutions?}
    B -- No --> C[Only Summarize available]
    B -- Yes --> D[/Choose: Save Iteration or Summarize/]

    D -- Save Iteration --> E[/Confirm filename\nBrand_Type_YYYY-MM-DD_Vn/]
    E --> F[Build .txt file content]

    F --> G[\Assessment results per hex\]
    F --> H[\GEMS section — iterationGems\]
    F --> I[\CHECK section — iterationChecks\]
    F --> J[\COAL section — iterationCoal\]
    F --> K[\USER NOTES — all NoteEntries\]

    G & H & I & J & K --> L[Upload to Databricks KB\nscope = brand]
    L --> M{Upload success?}
    M -- No --> N[Show error]
    M -- Yes --> O[Clear iteration state\ngems · checks · coal · notes]
    O --> P[Bump filename to Vn+1]
    P --> Q([Iteration saved ✓])

    D -- Summarize --> R[/Select files to include/]
    R --> S[POST to api/databricks/ai/summarize]
    S --> T[\Summary document generated\]
    T --> U[Save or download]
```

## 9. Knowledge Base — File Lifecycle

```mermaid flowchart LR
    A[/User uploads file\nor AI generates content/] --> B[uploadToKnowledgeBase]
    B --> C{Scope?}
    C -- Brand --> D[Tagged: brand + projectType]
    C -- Category --> E[Tagged: category only]
    C -- General --> F[No brand tag]

    D & E & F --> G[(Databricks\nFile Storage)]

    G --> H[listKnowledgeBaseFiles]
    H --> I{User role?}
    I -- Researcher/Admin --> J[See all files\napprove · unapprove · delete]
    I -- Manager --> K[See all files\nread · download only]

    G --> L[downloadKnowledgeBaseFile]
    L --> M[\File content available\nfor AI context/]

    G --> N[generateSummary]
    N --> O[\AI-generated synthesis\]
    O --> B
```

---

*Last updated: April 2026*




















































