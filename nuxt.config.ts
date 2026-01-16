// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},

    // ========== MODULES ==========
    modules: ['@nuxt/ui', '@nuxt/image', '@pinia/nuxt', 'nuxt-gtag'],

    // ========== STYLES ==========
    css: [
        '~/assets/css/main.css'
    ],

    // ========== SEO & META ==========
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
            title: 'Eka - Full Stack Developer Portfolio',
            meta: [
                {name: 'format-detection', content: 'telephone=no'},
                // Add Google Search Console verification after domain verification
                // { name: 'google-site-verification', content: 'YOUR_VERIFICATION_CODE' }
            ],
            link: [
                {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
                {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
                {rel: 'dns-prefetch', href: 'https://fonts.googleapis.com'},
            ],
        },
    },

    // ========== NITRO (Server) CONFIG ==========
    nitro: {
        compressPublicAssets: true,
        prerender: {
            crawlLinks: true,
            routes: ['/', '/privacy', '/terms'],
        },
    },

    // ========== IMAGE OPTIMIZATION ==========
    image: {
        quality: 80,
        format: ['webp', 'avif', 'png', 'jpg'],
    },

    // ========== RUNTIME CONFIG ==========
    runtimeConfig: {
        // Server-side private variables
        mode: process.env.NUXT_MODE || 'production',
        jwtSecret: process.env.NUXT_JWT_SECRET,
        googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
        redisUrl: process.env.NUXT_REDIS_URL,
        clientUrl: process.env.NUXT_CLIENT_URL || 'http://localhost:3000',

        pgHost: process.env.NUXT_PG_HOST || 'localhost',
        pgPort: process.env.NUXT_PG_PORT ? Number(process.env.NUXT_PG_PORT) : 5432,
        pgUser: process.env.NUXT_PG_USER || 'postgres',
        pgPassword: process.env.NUXT_PG_PASSWORD || 'password',
        pgDatabase: process.env.NUXT_PG_DATABASE || 'mydatabase',
        pgMax: process.env.NUXT_PG_MAX ? Number(process.env.NUXT_PG_MAX) : 10,
        pgIdleTimeoutMs: process.env.NUXT_PG_IDLE_TIMEOUT_MS ? Number(process.env.NUXT_PG_IDLE_TIMEOUT_MS) : 30000,
        pgConnectionTimeoutMs: process.env.NUXT_PG_CONNECTION_TIMEOUT_MS ? Number(process.env.NUXT_PG_CONNECTION_TIMEOUT_MS) : 2000,
        pgSsl: process.env.NUXT_PG_SSL === 'true',
        databaseUrl: process.env.NUXT_DATABASE_URL,

        minioEndpoint: process.env.NUXT_MINIO_ENDPOINT,
        minioAccessKey: process.env.NUXT_MINIO_ACCESS_KEY,
        minioSecretKey: process.env.NUXT_MINIO_SECRET_KEY,
        minioUseSsl: process.env.NUXT_MINIO_USE_SSL === 'true',
        minioPort: process.env.NUXT_MINIO_PORT ? Number(process.env.NUXT_MINIO_PORT) : 9000,

        geminiApiKey: process.env.NUXT_GEMINI_API_KEY,

        // Client-side public variables
        public: {
            googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID
                || process.env.NUXT_GOOGLE_CLIENT_ID
                || process.env.NUXT_GOOGLE_CLIENT_ID
                || '897905079551-k2chp1f1lu4f7dagjsg0nl03em61gm8m.apps.googleusercontent.com', // Temporary hardcoded fallback
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            clientUrl: process.env.NUXT_CLIENT_URL || process.env.NUXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        },
    },
})