# UI Components and Styling

TickerSage features a clean, modern user interface built with Svelte and styled using a combination of Tailwind CSS, DaisyUI components, and custom CSS. This document outlines the UI components and styling approach used in the application.

## UI Components Overview

The application's UI is divided into several main components:

### 1. Header

The header contains the application name and a brief description. It's implemented directly in the main page component.

### 2. Ticker Search

The ticker search component allows users to search for stock tickers. It includes:
- A search input field
- A dropdown menu with search results
- Search result items with "Add" buttons

### 3. Watchlist

The watchlist component displays the user's selected tickers. It includes:
- A list of ticker cards
- Each ticker card shows the ticker symbol and company name
- Remove buttons for each ticker
- An empty state message when no tickers are selected

### 4. SEC Filings Timeline

The filings timeline component displays SEC filings for all selected tickers. It includes:
- Filing cards ordered by date (newest first)
- Each filing shows:
  - Filing type (10-K, 10-Q, 8-K)
  - Filing date
  - Ticker symbol
  - Filing title
  - AI-generated summary
  - View Filing button (when applicable)
- An empty state message when no filings are available

### 5. Footer

A simple footer with copyright information.

## Styling Approach

The application uses a comprehensive styling approach with several layers:

### 1. Global Styles

Global styles are defined in the `<svelte:head>` section of the main page component. These styles apply to the entire application and include:
- Base typography
- Color scheme
- Layout utilities
- Component styling (cards, buttons, inputs, etc.)

### 2. Responsive Design

The UI is responsive, adapting to different screen sizes:
- Desktop: Multi-column layout for the watchlist
- Mobile: Single column layout with stacked components
- Flexible containers with max-width constraints
- Media queries for specific layout adjustments

### 3. Component-Specific Styles

Each component has specific styles for its unique needs:
- **Search Component**: Dropdown styling, result items
- **Watchlist Cards**: Grid layout, hover effects
- **Filing Cards**: Type badges with color coding, spacing

### 4. Visual Hierarchy

The design uses visual hierarchy to guide users:
- Section headers clearly separate content areas
- Color is used sparingly to highlight important elements
- Typography scale indicates information hierarchy
- Spacing creates logical grouping of related elements

### 5. Interactive Elements

Interactive elements have clear visual feedback:
- Buttons have hover and active states
- Dropdown items highlight on hover
- Cards have subtle hover effects
- Remove and add buttons use color to indicate their function

## Color Scheme

The application uses a simple, professional color scheme:
- **Primary Blue** (#3b82f6): Used for buttons, links, and primary actions
- **Dark Blue** (#2563eb): Used for hover states on primary elements
- **Light Gray** (#f5f7fa): Used for the page background
- **White** (#ffffff): Used for card backgrounds
- **Text Gray** (#333333): Used for main text
- **Secondary Text** (#64748b): Used for less important text
- **Border Gray** (#e5e7eb): Used for borders and dividers
- **Filing Types**:
  - 10-K: Light blue (#dbeafe) with dark blue text (#1e40af)
  - 10-Q: Light green (#dcfce7) with dark green text (#166534)
  - 8-K: Light purple (#f3e8ff) with dark purple text (#6b21a8)

## Accessibility Considerations

The UI includes several accessibility enhancements:
- Proper heading hierarchy (h1, h2, h3)
- Aria labels on interactive elements
- Sufficient color contrast
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure 