# Architecture and Tech Stack

## Overall Architecture

TickerSage is a client-side web application built with SvelteKit. The application follows a component-based architecture and uses a central store for state management. The data flow is unidirectional, with user interactions triggering state updates which then propagate to the UI components.

## Technology Stack

### Frontend Framework

- **SvelteKit**: A meta-framework for building web applications with Svelte, providing routing, server-side rendering capabilities, and more.
- **Svelte**: A reactive component-based JavaScript framework that compiles at build time rather than client-side runtime.

### UI Development

- **HTML/CSS/JavaScript**: Core web technologies used for building the user interface.
- **DaisyUI**: A plugin for Tailwind CSS providing pre-designed components.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.

### State Management

- **Svelte Stores**: Built-in Svelte mechanism for managing application state using reactive stores.

### Build Tools

- **Vite**: A fast, modern frontend build tool providing features like hot module replacement and optimized builds.
- **Node.js**: JavaScript runtime used for the development environment.
- **npm**: Package manager for JavaScript used to manage project dependencies.

### Code Quality

- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and developer experience.
- **ESLint**: Static code analysis tool for identifying problematic patterns in JavaScript code.

## Data Flow

1. **User Interaction**: User interacts with the UI components (search, add/remove ticker).
2. **Store Updates**: UI components dispatch actions to update the central ticker store.
3. **Reactivity**: Svelte's reactivity system automatically updates all subscribed components when store values change.
4. **UI Rendering**: Components re-render to reflect the new state.

## File Structure Overview

- **`src/routes/`**: Contains the page components and routing structure.
- **`src/lib/`**: Contains reusable components, stores, and utility functions.
- **`src/lib/stores/`**: Contains Svelte stores for state management.
- **`static/`**: Contains static assets like favicons.
- **`tailwind.config.js`**: Configuration for Tailwind CSS.
- **`svelte.config.js`**: Configuration for SvelteKit.
- **`package.json`**: Project metadata and dependencies.

## Deployment Architecture

The application is designed to be deployed as a static site or server-rendered application using SvelteKit's built-in adapter system. The default configuration uses the auto adapter which determines the best deployment strategy based on the target environment. 