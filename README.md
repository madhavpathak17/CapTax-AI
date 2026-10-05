# CapTax AI

CapTax AI is a multi-broker capital gains and foreign asset tax disclosure platform designed to simplify the management and analysis of investment transactions.

The application allows users to upload transaction data, manage their investment records, calculate capital gains using the FIFO method, track foreign assets, and view tax-related analytics through a web dashboard.

## Development Workflow

The project follows a frontend-backend architecture.

1. The React frontend provides the user interface for authentication, transactions, capital gains, foreign assets, and analytics.
2. The FastAPI backend handles API requests and business logic.
3. User-specific data is protected using JWT authentication.
4. Transaction data is processed by backend services before being used for calculations and analytics.
5. The frontend communicates with the backend through REST API endpoints.

## Current Features

- Multi-broker transaction management
- FIFO-based capital gains calculation
- Foreign asset tracking
- Tax analytics dashboard
- Transaction upload using CSV and Excel files
- Buy and sell transaction management
- Short-term and long-term gain classification
- Foreign currency to INR conversion
- JWT-based user authentication

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Python
- FastAPI
- Pydantic
- JWT Authentication

### Database

- MongoDB

## Transaction Processing

Users can upload transaction data from supported broker statements in CSV or Excel format.

The system processes the uploaded transactions and stores them against the authenticated user's account.

The transaction module supports:

- Transaction date
- Stock/asset symbol
- Asset type
- Transaction type
- Quantity
- Price
- Currency
- Broker information

## Capital Gains Calculation

CapTax AI uses the First In, First Out (FIFO) method for matching sell transactions with previously purchased lots.

The calculation process:

1. Transactions are grouped by asset symbol.
2. Transactions are ordered by date.
3. Buy transactions are maintained as purchase lots.
4. Sell transactions are matched with the oldest available purchase lots.
5. Cost basis and sale value are calculated for each matched quantity.
6. Gain or loss is calculated.
7. The holding period is determined.
8. Transactions are classified as short-term or long-term according to the configured holding period.

## Foreign Asset Management

The application provides functionality for recording and managing foreign assets.

Users can maintain information about their foreign investments and view a summary of their recorded foreign assets.

## Tax Analytics

The dashboard provides tax-related analytics based on the user's transaction data.

The system can provide information such as:

- Total capital gains
- Short-term gains
- Long-term gains
- Transaction summaries
- Portfolio-related statistics

## Authentication

CapTax AI uses JWT-based authentication to protect user-specific application data.

Authenticated users can access their own transactions, capital gains information, foreign assets, and dashboard analytics.

## Project Structure

```text
CapTax-AI/
├── backend/
│   ├── app/
│   │   ├── algorithms/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docs/
├── data/
├── sample_transactions.csv
├── .gitignore
└── README.md