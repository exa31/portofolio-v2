// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},

    // ========== MODULES ==========
    modules: ['@nuxt/ui', '@nuxt/image', '@pinia/nuxt'],

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
            routes: ['/'],
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
        mode: process.env.MODE || 'production',
        jwtSecret: process.env.JWT_SECRET,
        googleClientId: process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redisUrl: process.env.REDIS_URL,
        clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

        pgHost: process.env.PG_HOST || 'localhost',
        pgPort: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
        pgUser: process.env.PG_USER || 'postgres',
        pgPassword: process.env.PG_PASSWORD || 'password',
        pgDatabase: process.env.PG_DATABASE || 'mydatabase',
        pgMax: process.env.PG_MAX ? Number(process.env.PG_MAX) : 10,
        pgIdleTimeoutMs: process.env.PG_IDLE_TIMEOUT_MS ? Number(process.env.PG_IDLE_TIMEOUT_MS) : 30000,
        pgConnectionTimeoutMs: process.env.PG_CONNECTION_TIMEOUT_MS ? Number(process.env.PG_CONNECTION_TIMEOUT_MS) : 2000,
        pgSsl: process.env.PG_SSL === 'true',
        databaseUrl: process.env.DATABASE_URL,

        minioEndpoint: process.env.MINIO_ENDPOINT,
        minioAccessKey: process.env.MINIO_ACCESS_KEY,
        minioSecretKey: process.env.MINIO_SECRET_KEY,
        minioUseSsl: process.env.MINIO_USE_SSL === 'true',
        minioPort: process.env.MINIO_PORT ? Number(process.env.MINIO_PORT) : 9000,

        geminiApiKey: process.env.GEMINI_API_KEY,

        // Client-side public variables
        public: {
            googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
        },
    },
})