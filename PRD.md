# Planning Guide

An interactive, gamified ruleset learning application for the Azure Community Discord server that teaches community rules through engaging quiz-based challenges, memory games, and progress tracking - now with super nostalgic early 2000s web aesthetics!

**Experience Qualities**:
1. **Nostalgic & Fun** - Transport users back to the golden age of the early internet with playful, retro web design
2. **Educational & Engaging** - Learning rules should feel fun and rewarding, not like reading a boring legal document
3. **Gamified & Progressive** - Users earn points and unlock sections as they master each rule, creating motivation to complete

**Complexity Level**: Light Application (multiple features with basic state) - This is a learning app with quizzes, progress tracking, and nostalgic decorations that enhance the playful learning experience.

## Essential Features
For each core feature:
- Functionality (what it does)
- Purpose (why it matters)
- Trigger (how it starts)
- Progression (terse UX flow from start to finish - separate using `→`)
- Success criteria (how we'll validate it works)

### Interactive Rule Learning
- **Functionality**: Present complex multi-rule scenarios where users must identify which rules apply
- **Purpose**: Motivate users to complete all rules and provide clear sense of progress
- **Trigger**: User clicks on Learn tab or opens the app
- **Progression**: Display rule title and icon → Show detailed explanation → Present 2-3 real scenarios → User clicks "Got It!" → Move to next rule
- **Success criteria**: Users can read and mark rules as complete

### Mastery Progress Tracker
- **Functionality**: Track user progress through all rules with visual indicators
- **Purpose**: Provide clear sense of achievement and motivation
- **Trigger**: Automatically updated as user completes lessons and quizzes
- **Progression**: Display rule checklist → Show status indicators → Calculate overall progress → Display total points
- **Success criteria**: Progress persists between sessions and updates in real-time

### Quick Reference Guide
- **Functionality**: Provide easy lookup for users who have completed learning
- **Purpose**: Quick refresh on specific rules without full lesson
- **Trigger**: User clicks Reference tab
- **Progression**: Display all rules in condensed format → User searches or scrolls → Click to expand details
- **Success criteria**: Fast search and easy navigation to any rule

## Edge Case Handling
- **Quiz Failed Multiple Times**: Offer "Study Mode" with detailed explanations before retry
- **AI Assistant Unavailable**: Show offline message but keep core learning features functional
- **Perfect Score**: Celebrate with special animation and confetti
- **Skip Attempt**: Prevent skipping to later rules without completing earlier ones (progressive unlock)

## Design Direction

A super nostalgic early 2000s web aesthetic celebrating the playful, experimental design of the internet's golden age. Think animated GIFs, rainbow gradients, Comic Sans vibes, sparkles everywhere, marquee text, thick colorful borders, and unapologetically fun visual effects.

## Color Selection

Vibrant, saturated rainbow colors that evoke GeoCities and MySpace aesthetics.

- **Primary Color**: Hot Magenta/Purple (oklch(0.55 0.25 320)) - Main brand color with maximum 90s energy
- **Secondary Colors**: Electric Cyan (oklch(0.75 0.20 180)) - Supporting color for contrast and variety
- **Accent Color**: Lime Green (oklch(0.65 0.22 140)) - Success states and attention-grabbing highlights
- **Background**: Animated rainbow gradient cycling through pink, cyan, yellow, and green
- **Card Backgrounds**: White/cream with outset borders and colorful drop shadows

**Foreground/Background Pairings**:
- Primary on White (oklch(0.55 0.25 320) / oklch(0.99 0 0)): Black text (oklch(0.15 0 0)) - Ratio 12:1 ✓
- Accent on White (oklch(0.65 0.22 140) / oklch(0.99 0 0)): Black text (oklch(0.15 0 0)) - Ratio 8.5:1 ✓
- Secondary on White (oklch(0.75 0.20 180) / oklch(0.99 0 0)): Black text (oklch(0.15 0 0)) - Ratio 11:1 ✓

## Font Selection

Embrace the casual, playful typography of early web with Comic Sans as the primary font, evoking maximum nostalgia.

- **Primary Font**: Comic Sans MS (with Space Grotesk as fallback) - The iconic nostalgic font
- **Accent Font**: Courier New / JetBrains Mono - For stats, scores, and technical elements

**Typographic Hierarchy**:
- H1 (App Title): Comic Sans Bold/32px/colorful text shadow (pink/cyan/yellow layers)
- H2 (Section Titles): Comic Sans Bold/24px/text shadow
- H3 (Rule Names): Comic Sans Bold/20px
- Body (Rule Text): Comic Sans Regular/16px/1.6 line height
- Stats/Scores: Courier New Bold/24px/gradient text

## Animations

Animations should celebrate the experimental, playful spirit of early web design with generous use of movement, sparkles, and attention-grabbing effects.

Key animation moments:
- Rainbow gradient background continuously cycles (8s infinite)
- Floating stars twinkle across the entire page (2s infinite per star)
- Icons sparkle with rotating hue animation (2s infinite)
- Floating decorative elements (smileys, hearts, stars) at screen corners
- Scrolling marquee text at bottom of screen
- Elements float gently up and down (3s infinite)
- Rotating emojis and icons
- Glowing borders pulse with colorful shadows
- Perfect quiz scores trigger confetti burst
- Completed badges bounce in with spring animation

## Component Selection

**Components**:
- **Card** - Retro-styled with thick outset borders, colorful drop shadows, and gradient backgrounds
- **Button** - Loud gradient backgrounds, thick borders, glowing pulse animation on CTAs
- **Badge** - Gradient fills with borders and bold text
- **Progress** - Thick bars with double borders and gradient fills
- **Tabs** - Individual bordered buttons with active state gradients
- **Input** - Thick double borders with bold styling
- **Collapsible** - Reference guide expandable sections

**Customizations**:
- Remove all border radius (everything is square/rectangular)
- Thick borders (3-4px) with ridge/outset/double styles
- Colorful drop shadows (offset layered shadows in different colors)
- Gradient backgrounds on all interactive elements
- Animated decorations component with stars, sparkles, hearts
- Custom CSS animations for twinkle, float, rotate, sparkle effects

**States**:
- Buttons: Default (gradient bg + border), Hover (pulse glow), Active (scale), Disabled (grayscale)
- Cards: Retro border with shadow, hover brightens gradient
- Icons: Many have sparkle animation applied

**Icon Selection**:
- Star (phosphor) - Everywhere for decoration and points
- Sparkle (phosphor) - Decorative element throughout
- Heart (phosphor) - Corner decorations
- Smiley (phosphor) - Rotating corner decoration
- Trophy (phosphor) - Mastery and achievements
- ShieldCheck (phosphor) - Rules and completion

**Spacing**:
- Generous padding on all elements
- Thick borders take up visual space
- Cards have large drop shadows creating depth

**Mobile**:
- All decorations scale down but remain visible
- Stack elements vertically
- Maintain thick borders and shadows
- Touch targets remain large (48px+)
