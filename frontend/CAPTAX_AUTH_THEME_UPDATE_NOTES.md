# CapTax AI frontend auth and theme update

## Included
- Landing page now adapts to the operating system/browser color preference using Tailwind's `dark:` media variant.
- Dashboard account display ignores the literal placeholder name `string`; it falls back to username and then the email prefix.
- Registration form now collects full name, username, mobile number, email and password.
- Login has a **Forgot password?** link and a new `/forgot-password` page.
- The forgot-password page calls `POST /auth/forgot-password` and reports API failures instead of falsely claiming a reset email was sent.
- Existing logout/account menu, route protection, session restoration and dashboard chart work from the prior frontend update are retained.

## Backend integration required
The frontend is prepared to send registration fields `name`, `username`, `mobile`, `email`, and `password`. Your FastAPI registration schema/service must also validate and save `username` and `mobile`, and return those values in `data.user` for the account menu to show them.

The forgot-password screen calls `POST /auth/forgot-password` with `{ "email": "..." }`. The backend must implement a secure recovery flow before this feature can successfully send reset instructions. A secure flow normally uses a single-use, expiring token and a reset-password endpoint; it should not return or email a user's existing password.

The uploaded ZIP contained only the frontend. The backend was not modified, so the two backend capabilities above are not claimed as complete yet.

## Apply
Back up your existing `frontend/src`, then copy this ZIP's `frontend/src` files into your project. From the `frontend` directory run `npm install` and `npm run dev`.
