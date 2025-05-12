# TickerSage: SEC Filing Tracker

TickerSage is a web application that helps investors track SEC filings for stocks in their watchlist. Built with SvelteKit, it provides an intuitive user interface to search for stock tickers, manage a watchlist, and view associated SEC filings with AI-generated summaries.

![TickerSage Screenshot](https://via.placeholder.com/800x450?text=TickerSage+Screenshot)

## Features

- **Stock Ticker Search**: Search for stocks by ticker symbol or company name
- **Watchlist Management**: Add and remove tickers from your watchlist
- **SEC Filings Timeline**: View SEC filings for all watchlist stocks in chronological order
- **AI-Generated Summaries**: Quick summaries of key points in each SEC filing
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (included with Node.js)

### Installation

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

4. Open your browser to [http://localhost:5173](http://localhost:5173)

## Development

This project uses:
- **SvelteKit**: Framework for building the application
- **Svelte Stores**: For state management
- **Tailwind CSS & DaisyUI**: For styling
- **Vite**: For build tooling

For more information on development, see the [developer documentation](./docs/README.md).

## Current Status

TickerSage is currently in early development (v0.1.0). The application currently uses mock data for available tickers and SEC filings. See the [CHANGELOG](./CHANGELOG.md) for details on recent changes and planned enhancements.

## Project Structure

- `src/routes/`: Page components and routing
- `src/lib/stores/`: Svelte stores for state management
- `src/lib/components/`: Reusable UI components
- `static/`: Static assets
- `docs/`: Developer documentation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- SEC EDGAR database for inspiration
- SvelteKit and Svelte community for the excellent framework
- DaisyUI for UI components