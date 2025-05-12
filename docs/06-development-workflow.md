# Development Workflow

This document outlines the development workflow for TickerSage, including setup, development process, and best practices.

## Setting Up the Development Environment

### Prerequisites

- Node.js (LTS version recommended)
- npm (included with Node.js)
- A code editor (VS Code recommended)

### Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tickersage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to http://localhost:5173 to view the application

## Development Scripts

The following npm scripts are available for development:

- **`npm run dev`**: Start development server with hot module replacement
- **`npm run build`**: Build the application for production
- **`npm run preview`**: Preview the production build locally
- **`npm run check`**: Run SvelteKit type checking
- **`npm run check:watch`**: Run type checking in watch mode

## Development Workflow

### Making Changes

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes to the code
3. Test your changes locally with `npm run dev`
4. Check for type errors with `npm run check`
5. Commit your changes with descriptive commit messages

### File Organization

When working on the project, follow these organization guidelines:

1. **Page Components**: Place in `src/routes/`
2. **Reusable Components**: Place in `src/lib/components/`
3. **Stores**: Place in `src/lib/stores/`
4. **Utilities**: Place in `src/lib/utils/`
5. **Types**: Place in `src/lib/types/`
6. **Static Assets**: Place in `static/`

### Adding a New Feature

When adding a new feature, consider the following steps:

1. **Plan your feature**: Determine how it fits into the existing architecture
2. **Create new components**: If needed, create new Svelte components
3. **Update the store**: If the feature requires state management, update the store
4. **Add styling**: Ensure your feature matches the existing design system
5. **Add documentation**: Update documentation to reflect your changes

### Working with the Svelte Store

When making changes to the application state:

1. Add new state properties to the initial state object in `tickerStore.js`
2. Add new methods to the store for updating this state
3. Access the state in components using the `$tickerStore` syntax
4. Use reactive statements (`$:`) to derive values from the store

## Code Style Guidelines

### General

- Use ES6+ syntax
- Use meaningful variable and function names
- Keep functions small and focused on a single task
- Use comments to explain complex logic

### Svelte Components

- Use the `.svelte` file extension
- Follow the Svelte file structure: `<script>`, `<style>`, markup
- Use Svelte's reactive declarations where appropriate
- Keep components small and focused

### CSS/Styling

- Use the existing styling approach with inline styles in `<svelte:head>`
- Follow the established color scheme and design patterns
- Ensure responsive design for all new UI elements
- Consider accessibility in your styling choices

## Testing

Currently, the project doesn't have automated tests. When tests are added, they should include:

1. **Unit tests** for utility functions and store logic
2. **Component tests** for UI components
3. **Integration tests** for core user flows

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a production-ready build in the `.svelte-kit/output` directory.

## Troubleshooting Common Issues

### Module Import Issues

If you encounter issues with module imports:
- Ensure paths start with `$lib/` for imports from the lib directory
- Check your `jsconfig.json` configuration

### Styling Issues

If styles aren't applying correctly:
- Check that Tailwind CSS is properly configured
- Ensure your HTML elements have the correct class names
- Check the browser console for CSS errors

### Store Update Issues

If store updates aren't reflecting in the UI:
- Ensure you're using the `$` syntax to access store values
- Check that you're calling the correct store methods
- Verify that reactive statements depend on the correct variables 