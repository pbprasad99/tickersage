# TickerSage: SEC Filing Tracker

TickerSage is a web application that helps investors track SEC filings for stocks in their watchlist. Built with SvelteKit and PocketBase, it provides an intuitive user interface to search for stock tickers, manage a watchlist, and view associated SEC filings with AI-generated summaries.

![TickerSage Screenshot](https://via.placeholder.com/800x450?text=TickerSage+Screenshot)

## Features

- **Stock Ticker Search**: Search for stocks by ticker symbol or company name
- **Watchlist Management**: Add and remove tickers from your watchlist
- **SEC Filings Timeline**: View SEC filings for all watchlist stocks in chronological order
- **AI-Generated Summaries**: Quick summaries of key points in each SEC filing
- **User Authentication**: Create accounts and persist watchlists
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

- **Frontend**: SvelteKit application (`/src` directory)
- **Backend**: PocketBase server (`/backend` directory)

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (included with Node.js)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the PocketBase server:
   ```bash
   npm start
   ```

4. Create an admin account at [http://localhost:8090/_/](http://localhost:8090/_/)
   - Email: admin@tickersage.com
   - Password: 123456 (for development only)

5. Seed the database:
   ```bash
   npm run seed
   ```

### Frontend Setup

1. Open a new terminal and navigate to the root directory
   
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
- **SvelteKit**: Frontend framework
- **PocketBase**: Backend and database
- **Svelte Stores**: For state management
- **Tailwind CSS & DaisyUI**: For styling
- **Vite**: For build tooling

For more information on development, see:
- [Frontend documentation](./docs/README.md)
- [Backend documentation](./backend/README.md)

## Current Status

TickerSage is currently in early development (v0.1.0). See the [CHANGELOG](./CHANGELOG.md) for details on recent changes and planned enhancements.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- SEC EDGAR database for inspiration
- SvelteKit and Svelte community for the excellent framework
- PocketBase for the backend solution
- DaisyUI for UI components