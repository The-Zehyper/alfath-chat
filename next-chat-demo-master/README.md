# Daily Chat v2

Next.js realtime chat with custom username + password authentication.

- No email authentication
- No GitHub OAuth
- No external OAuth provider
- Username is case-insensitive and database-unique
- Passwords are hashed with Node.js scrypt
- HttpOnly signed session cookie
- Supabase is used as the database/realtime backend
- Chat message writes go through protected Next.js API routes

See `DEPLOYMENT.md` for setup.


## V3 build cleanup
- Removed the Supabase CLI package from `devDependencies`; Vercel no longer needs the `allow-scripts` warning for `supabase@1.127.4`.
- Stabilized the browser Supabase client so realtime hooks do not recreate clients on every render.
- Fixed the reported React Hook dependency warnings in `ChatPresence` and `ListMessages`.
- Authentication remains custom username/password with no email and no Supabase Auth.
