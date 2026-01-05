# Planning Guide

A community management web application for the Azure Community Discord server that displays member profile cards with XP/rank systems, allows role customization, and tracks rule agreements.

**Experience Qualities**:
1. **Community-focused** - The interface should feel welcoming and foster a sense of belonging within the Azure Community
2. **Gamified** - XP, ranks, and levels should feel rewarding and motivate engagement
3. **Professional yet playful** - Balance technical professionalism with approachable, friendly design

**Complexity Level**: Light Application (multiple features with basic state)
This is a profile showcase and role management tool with moderate interactivity - users view profiles, customize roles, and interact with rule agreements, but the core functionality remains straightforward.

## Essential Features

### Profile Card Display
- **Functionality**: Display user profile with avatar, username, rank tier (Accordian, Arcadia, etc.), level number, and XP progress bar
- **Purpose**: Showcase member progression and achievements within the community
- **Trigger**: Navigating to `/azure-community/{userid}` route
- **Progression**: Load user data → Display avatar and username → Show rank tier with visual badge → Display level and XP progress bar → Show additional stats
- **Success criteria**: Profile loads within 2 seconds, XP bar accurately reflects progress to next level, rank tier is visually distinct

### Role Customization Interface
- **Functionality**: Allow users to select and customize their server roles with color previews
- **Purpose**: Give members control over their server identity and visible roles
- **Trigger**: Clicking "Customize Roles" button on profile or navigation
- **Progression**: Open role panel → Display available roles with descriptions → User selects/deselects roles → Preview changes → Save configuration → Show success confirmation
- **Success criteria**: Role changes are immediately visible, maximum role limits are enforced, visual feedback confirms saves

### Rules Display and Agreement
- **Functionality**: Present server rules in an organized format with agreement tracking
- **Purpose**: Ensure new members understand community guidelines before full participation
- **Trigger**: New member joins or clicks "View Rules" button
- **Progression**: Display rules button → User clicks → Rules modal opens with scrollable content → User scrolls through → "Agree to Rules" button becomes active → User agrees → Agreement recorded → Visual confirmation
- **Success criteria**: All rules are readable, agreement state persists, can't bypass reading requirement

### XP Progress Visualization
- **Functionality**: Visual representation of XP accumulation and level progression
- **Purpose**: Motivate continued engagement and make progress tangible
- **Trigger**: Profile page load or XP update event
- **Progression**: Calculate current XP → Determine level and rank → Render progress bar → Display next milestone → Show rank badge
- **Success criteria**: Progress bar animates smoothly, percentages are accurate, rank changes are celebrated

## Edge Case Handling
- **Missing User Data**: Display placeholder profile with "User not found" message and link to community
- **Invalid User ID**: Redirect to community homepage with friendly error toast
- **Disconnected Bot State**: Show reconnection status banner, queue actions for when connection restores
- **Maximum Roles Reached**: Disable role selection with tooltip explaining limit
- **Slow Network**: Show skeleton loaders for all data-dependent components
- **Rules Already Agreed**: Show "Rules Agreed ✓" status instead of agreement button

## Design Direction
The design should evoke a modern Discord-inspired aesthetic with gaming/community vibes - think cyberpunk meets friendly community space. Use depth through layered cards, glowing accents on interactive elements, and smooth transitions that feel premium. The rank system should feel prestigious with metallic/gem-like tier badges.

## Color Selection
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
Animations should reinforce the gamified progression system and create moments of delight when users achieve milestones. Use subtle micro-interactions on all interactive elements.

Key animation moments:
- XP bar fills with smooth easing when profile loads (1.2s cubic-bezier)
- Rank badges scale and glow subtly on hover (0.3s)
- Role checkboxes check with satisfying bounce (0.4s spring)
- Rule agreement button pulses gently when active (infinite 2s ease)
- Level-up celebration with particle effects (if XP increases while viewing)
- Card entrance with staggered fade-up (0.6s delay between elements)

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
- Trophy (phosphor) - For achievements and milestones
- Lightning (phosphor) - For XP and activity indicators  
- Shield (phosphor) - For roles and permissions
- Check (phosphor) - For rule agreement and confirmations
- Gear (phosphor) - For customization settings
- Users (phosphor) - For community features
- Plug (phosphor) - For bot connection status

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
- Fixed bottom sheet for rule agreement on mobile instead of modal
- Larger touch targets (min 48px) for all interactive elements
- Reduce card padding to p-4 on mobile
- Sticky header with condensed username on scroll (mobile only)
