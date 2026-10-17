# CapTax AI frontend update

This package contains the frontend source with the account/logout flow and dashboard charts added.

## Changes
- Added a signed-in account menu with a visible **Log out / Switch account** action.
- Added navigation between Dashboard, Transactions, Capital Gains, Foreign Assets, and Tax Analytics.
- Protected application pages so logged-out users are sent to the login page.
- Restored the saved user/token from localStorage after a browser refresh.
- Cleared stale credentials when a protected API call returns HTTP 401.
- Added dashboard charts for monthly realized gains/losses, realized gain/loss by symbol, and foreign asset allocation.
- Charts use data returned by the existing dashboard, capital-gains, and foreign-assets API endpoints. Empty states are shown instead of fabricated chart data.
- Preserved the existing landing page and theme variables.

## Apply the update
1. Stop the frontend dev server.
2. Back up your current `frontend/src` folder.
3. Extract this ZIP and replace your project’s `frontend` folder with the included `frontend` folder, or copy the included `frontend/src` over your existing `frontend/src`.
4. Keep your existing `.env` and backend files unchanged.
5. From the `frontend` folder run:
   ```powershell
   npm install
   npm run dev
   ```
6. Sign in and test the account menu. Log out, then sign in with a second account to confirm that each account sees only its own data.

The ZIP intentionally excludes `node_modules`; npm installs platform-specific packages for your computer. Your FastAPI backend must be running at `http://127.0.0.1:8000`, as configured in `src/services/api.js`.

## Notes
- The charts display saved FIFO matches and saved foreign assets. They do not invent historical portfolio values.
- A browser-based logout removes the frontend session; it does not delete the user or their database records.
