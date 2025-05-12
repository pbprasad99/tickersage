# Project Overview

## Introduction

TickerSage is a web application designed to help investors track SEC filings for stocks in their watchlist. The application provides an intuitive user interface to search for stock tickers, add them to a watchlist, and view associated SEC filings in a timeline format. Each filing includes an AI-generated summary to help users quickly understand the key points without reading the entire document.

## Core Features

1. **Stock Ticker Search**: Users can search for stocks by ticker symbol or company name from a predefined list.

2. **Watchlist Management**: Users can add and remove tickers from their watchlist.

3. **SEC Filings Timeline**: The application displays SEC filings for all watchlist stocks in a chronological timeline.

4. **AI-Generated Summaries**: Each SEC filing includes a concise AI-generated summary of the key points.

5. **Responsive Design**: The application is designed to work well on both desktop and mobile devices.

## User Flow

1. User searches for a stock ticker or company name
2. Search results appear in a dropdown menu
3. User selects a ticker to add to their watchlist
4. The selected ticker appears in the watchlist section
5. SEC filings for all watchlist tickers appear in the timeline section
6. User can view filing details including type, date, title, and summary
7. User can click "View Filing" to open the original SEC document

## Current Limitations

1. The application currently uses mock data for available tickers and SEC filings.
2. There is no backend integration for real-time SEC filing updates.
3. User preferences are not persisted between sessions.

## Future Development Goals

1. Integration with SEC EDGAR API for real-time filing data
2. User authentication and persistent user preferences
3. Email notifications for new filings of watchlist stocks
4. Advanced filtering and sorting options for the filings timeline
5. Integration with financial news APIs to provide context alongside filings 