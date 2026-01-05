# Planning Guide

An interactive, gamified ruleset learning application for the Azure Community Discord server that teaches community rules through engaging quiz-based challenges, memory games, and progress tracking.

**Experience Qualities**:
1. **Educational & Engaging** - Learning rules should feel fun and rewarding, not like reading a boring legal document
2. **Gamified & Progressive** - Users earn points and unlock sections as they master each rule, creating motivation to complete
3. **Interactive & Memorable** - Active learning through quizzes and scenarios makes rules stick better than passive reading

**Complexity Level**: Light Application (multiple features with quiz state and progress tracking)
This is an educational tool that transforms dry rule reading into an engaging learning experience - users progress through rules sequentially, test their understanding, and track their mastery.

## Essential Features

### Progressive Rule Learning
- **Functionality**: Present rules one at a time with rich explanations and real-world examples
- **Purpose**: Make rules digestible and memorable through focused, sequential learning
- **Trigger**: App loads or user clicks "Next Rule" button
- **Progression**: Display rule title and icon → Show detailed explanation → Present 2-3 real scenario examples → User clicks "Got It!" → Rule marked as read → Progress to next rule
- **Success criteria**: Rules are clear and scannable, examples feel realistic, progress is saved between sessions

### Interactive Quiz Mode
- **Functionality**: Test understanding of each rule through multiple-choice scenario questions
- **Purpose**: Reinforce learning through active recall and scenario-based testing
- **Trigger**: User clicks "Take Quiz" after reading a rule or from progress dashboard
- **Progression**: Present scenario-based question → User selects answer → Show immediate feedback (correct/incorrect with explanation) → Award points for correct answers → Continue to next question
- **Success criteria**: Questions test understanding not memorization, feedback is educational, scores persist

### Mastery Progress Tracker
- **Functionality**: Visual dashboard showing completion status for each rule (unread, read, quizzed, mastered)
- **Purpose**: Motivate users to complete all rules and provide clear sense of progress
- **Trigger**: Always visible as header or sidebar component
- **Progression**: Display rule checklist → Show status indicators → Calculate overall completion percentage → Display total score → Unlock "Rules Master" badge when complete
- **Success criteria**: Progress updates in real-time, completion percentage is accurate, badge feels rewarding

### Scenario Challenge Mode
- **Functionality**: Present complex multi-rule scenarios where users must identify which rules apply
- **Purpose**: Test comprehensive understanding across multiple rules simultaneously
- **Trigger**: User unlocks after reading all rules, or clicks "Scenario Challenge"
- **Progression**: Present realistic community situation → User selects all applicable rules from list → Validate selections → Provide detailed explanation → Award bonus points
- **Success criteria**: Scenarios feel realistic, multiple rules can apply, explanations teach nuance

### Quick Reference Guide
- **Functionality**: Searchable, scannable summary of all rules with key points highlighted
- **Purpose**: Provide easy lookup for users who have completed learning but need quick refresher
- **Trigger**: User clicks "Quick Reference" tab or searches for specific rule topic
- **Progression**: Display all rules in condensed format → User searches or scrolls → Click rule to expand details → Copy rule link for sharing
- **Success criteria**: Search is instant and accurate, condensed view is scannable, expansions are smooth

### AI Rule Clarification Assistant
- **Functionality**: Answer specific questions about rules using natural language
- **Purpose**: Help users understand edge cases or get personalized clarification
- **Trigger**: User types question in chat interface available on any rule
- **Progression**: User asks question about current rule → AI analyzes question with rule context → Provides clear 2-3 sentence answer with examples → Conversation continues
- **Success criteria**: Answers are accurate and helpful, maintains context, cites specific rules

## Edge Case Handling
- **All Rules Completed**: Show "Rules Master" certificate and confetti animation, unlock advanced scenarios
- **Quiz Failed Multiple Times**: Offer "Study Mode" with detailed explanations before retry
- **Navigation Away Mid-Quiz**: Auto-save progress and allow resume from last question
- **AI Assistant Unavailable**: Show offline message but keep core learning features functional
- **No Progress Yet**: Show welcoming onboarding with clear "Start Learning" call-to-action
- **Perfect Score**: Celebrate with special animation and encourage sharing achievement
- **Returning User**: Resume from last incomplete rule automatically with option to restart
- **Skip Attempt**: Prevent skipping to later rules without completing earlier ones (progressive unlock)

## Design Direction
The design should evoke a modern educational platform with game-like elements - think Duolingo meets Discord community vibes. Use bright, encouraging colors that make learning feel positive and approachable. Progress should be visually celebrated with confetti, badges, and smooth transitions. Cards should have depth and feel interactive, with clear visual feedback for correct/incorrect answers. The overall aesthetic should be friendly and motivating, not intimidating.

## Color Selection
A welcoming, energetic palette that encourages learning and celebrates progress.

- **Primary Color**: Vibrant Purple (oklch(0.60 0.20 290)) - Represents learning, wisdom, and achievement
- **Secondary Colors**: 
  - Warm Background (oklch(0.96 0.01 90)) - Inviting cream/warm white base
  - Soft Card Surface (oklch(0.98 0.005 90)) - Elevated card backgrounds
- **Accent Color**: Electric Green (oklch(0.70 0.18 145)) - Success states, correct answers, progress completion
- **Supporting Colors**:
  - Warning Orange (oklch(0.68 0.18 50)) - Incorrect answers with constructive feedback
  - Info Blue (oklch(0.60 0.15 240)) - Tips, hints, and informational callouts
  - Celebration Gold (oklch(0.75 0.15 80)) - Badges, achievements, mastery states
  
**Foreground/Background Pairings**:
- Primary Purple on Warm Background (oklch(0.60 0.20 290) / oklch(0.96 0.01 90)): White text (oklch(0.98 0 0)) - Ratio 6.5:1 ✓
- Electric Green on White Card (oklch(0.70 0.18 145) / oklch(0.98 0.005 90)): Dark text (oklch(0.20 0.01 145)) - Ratio 8.2:1 ✓
- Card Surface (oklch(0.98 0.005 90)): Dark text (oklch(0.18 0.02 290)) - Ratio 13.1:1 ✓
- Warning Orange on Card (oklch(0.68 0.18 50) / oklch(0.98 0.005 90)): Dark text (oklch(0.20 0.02 50)) - Ratio 7.5:1 ✓

## Font Selection
Fonts should feel friendly and modern, optimized for reading educational content while maintaining the Discord community connection.

- **Primary Font**: Space Grotesk - Modern, geometric, friendly and highly readable
- **Accent Font**: JetBrains Mono - For quiz scores, points, and stats

**Typographic Hierarchy**:
- H1 (Page Title): Space Grotesk Bold/36px/tight (-0.01em) letter spacing
- H2 (Rule Titles): Space Grotesk Bold/28px/normal letter spacing
- H3 (Section Headers): Space Grotesk SemiBold/22px/normal
- Body (Rule Text): Space Grotesk Regular/18px/1.7 line height for comfortable reading
- Quiz Questions: Space Grotesk Medium/20px/1.6 line height
- Stats/Scores: JetBrains Mono SemiBold/24px/tabular numbers
- Labels: Space Grotesk Medium/14px/uppercase/wide (0.05em) tracking

## Animations
Animations should celebrate progress, provide clear feedback for quiz answers, and make transitions feel smooth and encouraging. Every correct answer should feel rewarding, and the overall experience should feel alive and responsive.

Key animation moments:
- Progress bar fills with satisfying easing when rule is completed (0.8s ease-out)
- Confetti burst animation when achieving mastery or perfect score (2s)
- Correct answer: Card bounces and turns green with checkmark animation (0.5s spring)
- Incorrect answer: Card shakes horizontally with orange highlight (0.4s)
- Rule cards fade and slide in from bottom when navigating (0.6s stagger)
- Badge unlock: Scale up from 0 with rotation and glow effect (0.8s elastic)
- Points increment: Numbers count up with slight scale pulse (0.6s)
- "Got It!" button pulses subtly to draw attention (2s infinite)
- Progress circles fill clockwise with smooth arc animation (1s)
- Celebration: Multi-colored confetti falls from top of screen
- Tab transitions slide smoothly with crossfade (0.3s ease)

## Component Selection

**Components**:
- **Card** - For rule display, quiz questions, and progress dashboard (soft shadows, rounded corners)
- **Progress** - Linear bars for overall progress and circular indicators for individual rules
- **Button** - Primary actions (Got It, Submit Answer, Next) with active states and micro-interactions
- **Tabs** - Navigation between Learn, Quiz, and Reference modes
- **Badge** - Achievement indicators and rule status (read, quizzed, mastered)
- **RadioGroup** - Multiple choice quiz answers with clear selection states
- **ScrollArea** - For rule content and reference guide
- **Dialog** - For completion celebrations and achievement unlocks
- **Alert** - For feedback on quiz answers (success/error variants)
- **Separator** - Visual breaks between rules in reference guide

**Customizations**:
- Confetti component using framer-motion for celebrations
- Custom progress circles with gradient strokes for rule status
- Quiz answer cards with hover lift effect and active selection state
- Point counter with animated number transitions
- Badge unlock modal with spotlight effect and animated trophy icon
- Rule example cards with distinct styling (border-left accent, light background)

**States**:
- Buttons: Default (solid color), Hover (slight lift + brightness), Active (scale 0.97), Disabled (50% opacity + no interaction)
- Quiz answers: Unselected (white bg, border), Selected (purple border, subtle bg), Correct (green bg + icon), Incorrect (orange bg + shake)
- Progress indicators: Empty (gray), In Progress (purple gradient), Complete (green with checkmark)
- Rule cards: Locked (grayed + lock icon), Current (highlighted border), Completed (checkmark badge)

**Icon Selection**:
- ShieldCheck (phosphor) - For rules and rule completion
- Trophy (phosphor) - For achievements and mastery
- Check (phosphor) - For correct answers and completions
- X (phosphor) - For incorrect answers  
- Star (phosphor) - For points and scoring
- Brain (phosphor) - For AI clarification assistant
- List (phosphor) - For reference guide
- Play (phosphor) - For starting quizzes
- Lock (phosphor) - For locked rules
- Fire (phosphor) - For streaks and engagement
- Question (phosphor) - For quiz mode
- Books (phosphor) - For learning content

**Spacing**:
- Card padding: p-6 for quiz cards, p-8 for rule content cards
- Section gaps: gap-6 between rules, gap-4 within quiz options
- Button spacing: px-8 py-4 for primary CTAs, px-6 py-3 for secondary
- Grid gaps: gap-6 for progress dashboard, gap-4 for quiz options
- Margins: mb-8 between major sections, mb-6 between rule sections

**Mobile**:
- Stack all content vertically on <768px
- Increase touch targets to min 48px height for all interactive elements
- Single column layout for quiz answers
- Fixed bottom bar with current progress and next button
- Reduce card padding to p-4 on mobile
- Larger text for quiz questions (22px) on mobile for readability
- Sticky header with compact progress indicator
