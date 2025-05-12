# Project Structure

The TickerSage project follows the standard SvelteKit project structure with some customizations. This document outlines the key directories and files in the project.

## Root Directory

- **`package.json`**: Contains project metadata, dependencies, and npm scripts.
- **`package-lock.json`**: Auto-generated file that locks dependency versions.
- **`svelte.config.js`**: SvelteKit configuration file.
- **`vite.config.js`**: Vite build tool configuration.
- **`tailwind.config.js`**: Tailwind CSS configuration for styling.
- **`postcss.config.js`**: PostCSS configuration for Tailwind CSS processing.
- **`jsconfig.json`**: JavaScript/TypeScript configuration for the project.

## Source Code (`src/`)

The `src/` directory contains all the application source code, organized as follows:

### Routes (`src/routes/`)

SvelteKit uses a file-based routing system, where each file in the `routes` directory becomes a route in the application.

- **`+page.svelte`**: The main page component of the application.
- **`+layout.svelte`**: The layout wrapper for all pages in the application.

### Library (`src/lib/`)

The `lib` directory contains reusable utilities, components, and stores.

#### Stores (`src/lib/stores/`)

- **`tickerStore.js`**: A Svelte store that manages the application state, including available tickers, selected tickers, and SEC filings.

### Static Assets (`static/`)

- **`favicon.png`**: The website favicon.

## Key Files Breakdown

### Main Page Component (`src/routes/+page.svelte`)

This is the main component of the application, which includes:

- Ticker search functionality
- Watchlist management
- SEC filings timeline display

The component is structured as follows:

1. **Script Section**: Contains import statements, variable declarations, reactive statements, and functions.
2. **Style Section**: Contains CSS styles for the component.
3. **Markup Section**: Contains the HTML structure of the page.

### Store (`src/lib/stores/tickerStore.js`)

This file defines a Svelte writable store that manages:

- Available tickers (stock symbols and names)
- Selected tickers (user's watchlist)
- SEC filings data (currently mock data)
- State management functions (addTicker, removeTicker, reset)

## Configuration Files

### SvelteKit Configuration (`svelte.config.js`)

Configures the SvelteKit framework, including:
- The adapter for deployment
- Other SvelteKit specific options

### Vite Configuration (`vite.config.js`)

Configures the Vite build tool, including:
- Plugins (SvelteKit)
- Build options

### Tailwind Configuration (`tailwind.config.js`)

Configures Tailwind CSS, including:
- Content sources for purging unused CSS
- Theme customizations
- Plugins (DaisyUI)

### PostCSS Configuration (`postcss.config.js`)

Configures PostCSS, which processes CSS with plugins:
- Tailwind CSS
- Autoprefixer 