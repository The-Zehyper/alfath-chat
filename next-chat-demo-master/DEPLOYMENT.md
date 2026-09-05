# Daily Chat v2 — Deploy tanpa Email/OAuth

Versi ini menggunakan autentikasi username + password custom. Tidak menggunakan Supabase Auth, email, GitHub OAuth, atau callback OAuth.

## 1. Supabase

Jalankan seluruh `supabase.sql` di **Supabase → SQL Editor → New query**.

## 2. Environment Variables di Vercel

Tambahkan:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SESSION_SECRET=...
```

`SUPABASE_SERVICE_ROLE_KEY` dan `SESSION_SECRET` **server-only**. Jangan pernah memakai prefix `NEXT_PUBLIC_` untuk keduanya.

Buat `SESSION_SECRET` berupa string acak panjang, minimal 32 karakter.

## 3. Tidak perlu Email Auth

Supabase Authentication / Email tidak perlu diaktifkan. Project ini tidak memakai Supabase Auth sama sekali.

## 4. Deploy

Push project ke repository, import ke Vercel, masukkan semua environment variables, lalu Deploy.

## 5. Alur

Daftar → username + password → langsung masuk chat.

Login → username + password → langsung masuk chat.

Username bersifat unik dan case-insensitive. Database memiliki unique index `lower(username)`, sehingga race condition pendaftaran tetap aman.

Password disimpan sebagai hash `scrypt`, bukan plaintext.


## V3 notes
V3 does not install the Supabase CLI package. The browser uses `@supabase/ssr` and `@supabase/supabase-js` only as application libraries. Keep the four environment variables from the V2 setup. `SUPABASE_SERVICE_ROLE_KEY` remains server-only.
