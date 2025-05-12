# TickerSage Backend

This directory contains the backend infrastructure for TickerSage using PocketBase, a lightweight open-source backend for your next project.

## Setup and Running

### Prerequisites

- Node.js (v16+)
- npm

### Initial Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start PocketBase:
   ```bash
   npm start
   ```

   This will start PocketBase at [http://localhost:8090](http://localhost:8090)

3. Create an admin account at [http://localhost:8090/_/](http://localhost:8090/_/)
   - Use `admin@tickersage.com` as the email (or any email you prefer)
   - Use a secure password

4. Seed the database with initial data by setting your admin password as an environment variable:
   ```bash
   # Replace YOUR_PASSWORD with your actual admin password
   export PB_ADMIN_PASSWORD=YOUR_PASSWORD
   npm run seed
   ```

   Alternatively, you can set the password in a single command:
   ```bash
   PB_ADMIN_PASSWORD=YOUR_PASSWORD npm run seed
   ```

## Database Structure

TickerSage uses three main collections:

### 1. Tickers Collection

Stores information about stock tickers.

Fields:
- `symbol` (text): The ticker symbol (e.g., AAPL)
- `name` (text): The company name (e.g., Apple Inc.)

### 2. Filings Collection

Stores SEC filings data.

Fields:
- `ticker` (relation): Reference to a ticker
- `type` (text): Filing type (e.g., 10-K, 10-Q, 8-K)
- `date` (date): Filing date
- `title` (text): Filing title
- `summary` (text): AI-generated summary of the filing
- `url` (url): Link to the original filing

### 3. Users Collection

Stores user information (automatically created by PocketBase).

### 4. Users_Tickers Collection

Stores user watchlist data.

Fields:
- `user` (relation): Reference to a user
- `ticker` (relation): Reference to a ticker

## Development Workflow

- PocketBase runs on port 8090
- Admin UI is available at [http://localhost:8090/_/](http://localhost:8090/_/)
- API is available at [http://localhost:8090/api/](http://localhost:8090/api/)

## Data Backup

PocketBase stores its data in a SQLite database file `pb_data/data.db`. You can back up this file to preserve your data.

## Resetting the Database

To reset the database:
1. Stop PocketBase
2. Delete the `pb_data` directory
3. Start PocketBase
4. Create a new admin account
5. Seed the database again

## Security Notice

For development purposes, we use environment variables to store credentials. In a production environment, use a proper secrets management system and never commit credentials to your repository. 