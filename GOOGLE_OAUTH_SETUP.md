# Google OAuth Setup untuk Dual Domain Support

Panduan konfigurasi Google OAuth untuk mendukung kedua domain:

- `eka-dev.cloud`
- `www.eka-dev.cloud`

## Langkah 1: Update di Google Cloud Console

### 1.1 Authorized Redirect URIs

Pastikan kedua domain terdaftar di Google Cloud Console:

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project Anda
3. Navigasi ke **APIs & Services** → **Credentials**
4. Klik OAuth 2.0 Client ID Anda
5. Tambahkan kedua redirect URI berikut di **Authorized redirect URIs**:
   ```
   https://eka-dev.cloud/
   https://www.eka-dev.cloud/
   ```
6. Simpan perubahan

### 1.2 Authorized Domains (Optional)

Jika menggunakan Google Sign-In button, tambahkan domain di **OAuth consent screen**:

1. Navigasi ke **OAuth consent screen**
2. Di **Authorized domains**, tambahkan:
   ```
   eka-dev.cloud
   www.eka-dev.cloud
   ```
3. Simpan

## Langkah 2: Konfigurasi Aplikasi

### 2.1 Environment Variables

Pastikan `.env` atau `.env.production` memiliki:

```env
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
NUXT_CLIENT_URL=https://eka-dev.cloud  # Default untuk server-side
```

### 2.2 Cara Kerja Dynamic Domain Detection

Composable `useGoogleSignIn.ts` sekarang:

1. **Server-side rendering**: Menggunakan default `https://eka-dev.cloud`
2. **Client-side**: Mendeteksi domain yang diakses user secara otomatis:
    - Jika user akses via `www.eka-dev.cloud` → redirect ke `https://www.eka-dev.cloud/`
    - Jika user akses via `eka-dev.cloud` → redirect ke `https://eka-dev.cloud/`

```typescript
// Contoh dari useGoogleSignIn.ts
const getCurrentDomain = (): string => {
    if (process.server) {
        return 'https://eka-dev.cloud'
    }

    const currentHost = window.location.hostname
    const protocol = window.location.protocol
    return `${protocol}//${currentHost}`
}
```

## Langkah 3: Testing

### Test di Development

```bash
npm run dev
```

Kemudian akses via:

1. `http://localhost:3000` - Test di local
2. Check browser console untuk melihat domain yang terdeteksi

### Test di Production

Akses aplikasi via kedua URL:

1. `https://eka-dev.cloud/login` - Seharusnya login berhasil
2. `https://www.eka-dev.cloud/login` - Seharusnya login berhasil

## Troubleshooting

### Error: "Redirect URI mismatch"

**Solusi**: Pastikan kedua domain terdaftar di Google Cloud Console (Langkah 1.1)

### Error: "Could not load credentials"

**Solusi**: Pastikan `NUXT_PUBLIC_GOOGLE_CLIENT_ID` sudah diset di environment

### Chrome Console: "ReferenceError: Cannot access '_' before initialization"

**Solusi**:

- Pastikan Google Sign-In library sudah ter-load
- Pastikan composable diakses di client-side (gunakan `<ClientOnly>`)

## Debugging

Buka Browser DevTools Console untuk melihat logs:

```
[Google Auth] Current Domain: https://www.eka-dev.cloud
[Google Auth] Redirect URI: https://www.eka-dev.cloud/
```

Ini menunjukkan domain yang terdeteksi dan URI yang akan digunakan untuk OAuth.
