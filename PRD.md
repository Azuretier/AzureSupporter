# Planning Guide

An interactive, gamified ruleset learning application for the Azure Community Discord server that teaches community rules through engaging quiz-based challenges, memory games, and progress tracking.

2. **Gamified & Progressi
1. **Educational & Engaging** - Learning rules should feel fun and rewarding, not like reading a boring legal document
2. **Gamified & Progressive** - Users earn points and unlock sections as they master each rule, creating motivation to complete
3. **Interactive & Memorable** - Active learning through quizzes and scenarios makes rules stick better than passive reading

- **Progression**: Display rule title and icon → Show detailed explanation → Present 2-3 real sce


- **Trigger**: User c

### Mastery Progress Tracker
- **Purpose**: Motivate users to complete all rules and provide clear sense of progress
- **Progression**: Display rule checklist → Show status indicators → Calculate overall 

- **Functionality**: Present complex multi-rule scenarios where users must identify which rules apply
- **Trigger**: User unlocks after reading all rules, or clicks "Scenario Challenge"

### Quick Reference Guide
- **Purpose**: Provide easy lookup for users who have completed learning but need quick refresh
- **Progression**: Display all rules in condensed format → User searches or scroll

- **Functionality**: Answer specific questions about rules using natural language
- **Trigger**: User types question in chat interface available on any rule

## Edge Case Handling
- **Quiz Failed Multiple Times**: Offer "Study Mode" with detailed explanations before retry
- **AI Assistant Unavailable**: Show offline message but keep core learning features fu
- **Perfect Score**: Celebrate with special animation and en
- **Skip Attempt**: Prevent skipping to later rules without completing earlier ones (progressive unlock)
## Design Direction

A welcoming, energetic pale
- **Primary Color**: Vibrant Purple (oklch(0.60 0.20 290)) - Represents learning, wisdom, and achieve
  - Warm Background (oklch(0.96 0.01 90)) - Inviting cream/warm white base
- **Accent Color**: Electric Green (oklch(0.70 0.18 145)) - Success states, correct
  - Warning Orange (oklch(0.68 0.18 50)) - Incorrect answers with constructive feedback
  - Celebration Gold (oklch(0.75 0.15 80)) - Badges, achievements, mastery states

- Electric Green on White
- Warning Orange on Card (oklch(0.68 0.18 50) / oklch(0.98 0.005 90)): Dark text (oklch(0.2
## Font Selection

- **Accent Font**: JetBrains Mono - For quiz scores, points, and stats
**Typographic Hierarchy**:

- Body (Rule Text): Space Grotesk R
- Stats/Scores: JetBrains Mono SemiBold/24px/tabular numbers

Animations should celebrate progress, provide clear feedback for quiz answ
Key animation moments:
- Confetti burst animation when achieving mastery or perfect score (2s)

- Badge unlock: Scale
- "Got It!" button pulses subtly to draw attention (2s infinite)
- Celebration: Multi-colored confetti falls from top of screen


- **Card** - For rule display, quiz questions, and progress dashboard (soft
- **Button** - Primary actions (Got It, Submit Answer, Next) with active states and 
- **Badge** - Achievement indicators and rule status (read, quizzed, mastered)
- **ScrollArea** - For rule content and reference guide
- **Alert** - For feedback on quiz answers (success/error variants)


- Quiz answer cards
- Badge unlock modal with spotlight effect and animated trophy icon

- Buttons: Default
A dark, tech-forward palette with vibrant accent colors representing different rank tiers.

- **Primary Color**: Deep Electric Blue (oklch(0.55 0.18 250)) - Represents the Azure brand and technological sophistication
- **Secondary Colors**: 
  - Dark Slate Background (oklch(0.15 0.01 250)) - Primary surface for content
  - Charcoal Card Surface (oklch(0.22 0.015 250)) - Elevated card backgrounds
- **Accent Color**: Vibrant Cyan (oklch(0.75 0.15 200)) - CTAs, progress bars, and interactive highlights
- **Rank Tier Colors**:
  - Accordian: Bronze/Amber (oklch(0.65 0.15 60))
  - Arcadia: Silver/Steel (oklch(0.70 0.02 250))
  - Apex: Gold (oklch(0.75 0.18 90))
  - Legendary: Purple/Violet (oklch(0.60 0.20 290))
  
**Foreground/Background Pairings**:
- Primary Blue on Dark Slate (oklch(0.55 0.18 250) / oklch(0.15 0.01 250)): White text (oklch(0.98 0 0)) - Ratio 8.2:1 ✓
- Vibrant Cyan on Charcoal Card (oklch(0.75 0.15 200) / oklch(0.22 0.015 250)): Dark text (oklch(0.15 0.01 250)) - Ratio 7.8:1 ✓
- Card Surface (oklch(0.22 0.015 250)): Light text (oklch(0.92 0.01 250)) - Ratio 12.5:1 ✓

## Font Selection
Fonts should communicate technical precision while remaining approachable and highly readable for community content.

- **Primary Font**: Space Grotesk - Modern, geometric, slightly technical but friendly
- **Accent Font**: JetBrains Mono - For level numbers, XP counts, and stat displays

**Typographic Hierarchy**:
- H1 (Profile Username): Space Grotesk Bold/32px/tight (-0.02em) letter spacing
- H2 (Section Titles): Space Grotesk SemiBold/24px/normal letter spacing
- H3 (Rank Name): Space Grotesk Medium/20px/wide (0.05em) letter spacing for prestige
- Body (Descriptions): Space Grotesk Regular/16px/1.6 line height
- Stats/Numbers: JetBrains Mono Medium/18px/tabular numbers
- Small (Labels): Space Grotesk Medium/14px/uppercase/wide (0.08em) tracking

## Animations
Animations should reinforce the gamified progression system, create moments of delight when users achieve milestones, and emphasize the "smartness" of AI features with subtle, intelligent-feeling transitions. Use subtle micro-interactions on all interactive elements.

Key animation moments:
- XP bar fills with smooth easing when profile loads (1.2s cubic-bezier)
- Rank badges scale and glow subtly on hover (0.3s)
- Role checkboxes check with satisfying bounce (0.4s spring)
- Rule agreement button pulses gently when active (infinite 2s ease)
- Level-up celebration with particle effects (if XP increases while viewing)
- Card entrance with staggered fade-up (0.6s delay between elements)
- AI loading states with pulsing accent glows and shimmer effects
- AI response text fades in smoothly with slight upward motion (0.4s)
- Sparkle icons subtly rotate and scale on AI feature cards
- Chat messages in Rules Assistant slide in from appropriate direction

## Component Selection

**Components**:
- **Card** - For profile container, rules modal, and role panels (custom shadow and border glow)
- **Progress** - XP progress bars with custom styling for tier colors
- **Badge** - Rank tier indicators with custom gradient backgrounds
- **Button** - Primary actions (Agree, Save, Customize) with hover glow effects
- **Checkbox** - Role selection with custom check animation
- **Dialog** - Rules display modal with scrollable content area
- **Tabs** - Navigation between profile sections (Overview, Stats, Roles)
- **Avatar** - User profile image with online status indicator ring
- **ScrollArea** - For rules content and role lists
- **Separator** - Visual dividers between sections with gradient fading

**Customizations**:
- Custom gradient backgrounds for rank badges using tier colors
- Glowing border effect on cards using box-shadow and accent color
- Animated progress bar with trail effect showing recent XP gains
- Custom level number display in a hexagonal badge shape
- Particle system component for level-up celebrations (using framer-motion)

**States**:
- Buttons: Default (subtle glow), Hover (increased glow + scale 1.02), Active (scale 0.98), Disabled (40% opacity + no glow)
- Role checkboxes: Unchecked (border only), Checked (filled with bounce), Disabled (muted + tooltip)
- Progress bars: Filling (animated gradient), Complete (pulse effect), Inactive (muted colors)
- Cards: Default (subtle elevation), Hover (increased elevation + glow), Loading (skeleton shimmer)

**Icon Selection**:
- Crown (phosphor) - For rank indicators and premium features

- Lightning (phosphor) - For XP and activity indicators  
- Shield (phosphor) - For roles and permissions
- Check (phosphor) - For rule agreement and confirmations

- Users (phosphor) - For community features

- Sparkle (phosphor) - For AI-powered features and smart tools

- Chats (phosphor) - For AI rules assistant
- MagicWand (phosphor) - For AI profile generation
- Robot (phosphor) - For AI assistant avatar

**Spacing**:
- Card padding: p-6 (24px) for standard cards, p-8 (32px) for hero profile card
- Section gaps: gap-6 (24px) between major sections, gap-4 (16px) within sections
- Button spacing: px-6 py-3 for primary actions, px-4 py-2 for secondary
- Grid gaps: gap-4 for role grid, gap-8 for dashboard layout
- Margins: mb-8 between page sections, mb-4 between related elements

**Mobile**:
- Stack profile sections vertically on <768px
- Single column role grid on mobile, 2-3 columns on desktop
- Collapse stats into accordion on mobile for space efficiency

- Larger touch targets (min 48px) for all interactive elements

- Sticky header with condensed username on scroll (mobile only)
