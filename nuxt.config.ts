// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: false},

    // ========== MODULES ==========
    modules: ['@nuxt/ui', '@nuxt/image', '@pinia/nuxt', 'nuxt-gtag'],

    css: ['~/assets/css/main.css'],

    // ========== BUILD ==========
    build: {
        transpile: ['@google/genai'],
    },

    // ========== VITE ==========
    vite: {
        esbuild: {
            minifyIdentifiers: false,
        },

        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (!id.includes('node_modules')) return

                        // ✅ UI libs aman
                        if (id.includes('@nuxt/ui') || id.includes('@headlessui')) {
                            return 'vendor-ui'
                        }

                        // ✅ Google libs aman
                        if (id.includes('@google')) {
                            return 'vendor-google'
                        }

                        // ❌ JANGAN split util / nuxt core
                        return undefined
                    },
                },
            },
        },
    },

    // ========== SSR ==========
    ssr: true,

    // ========== SEO ==========
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
            title: 'Eka - Full Stack Developer Portfolio',
            meta: [{name: 'format-detection', content: 'telephone=no'}],
            link: [
                {rel: 'icon', href: '/favicon.ico'},
                {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
                {rel: 'dns-prefetch', href: 'https://fonts.googleapis.com'},
            ],
        },
    },

    // ========== NITRO ==========
    nitro: {
        compressPublicAssets: {
            gzip: true,
            brotli: true,
        },
        minify: true,
        prerender: {
            crawlLinks: true,
            routes: ['/', '/privacy', '/terms'],
        },
    },

    // ========== IMAGE ==========
    image: {
        quality: 80,
        format: ['webp', 'avif'],
    },

    // ========== RUNTIME CONFIG ==========
    runtimeConfig: {
        mode: process.env.NUXT_MODE || 'production',
        jwtSecret: process.env.NUXT_JWT_SECRET,
        googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
        redisUrl: process.env.NUXT_REDIS_URL,
        clientUrl: process.env.NUXT_CLIENT_URL || 'https://eka-dev.cloud',

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

        public: {
            googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://eka-dev.cloud',
            clientUrl: process.env.NUXT_CLIENT_URL || 'https://eka-dev.cloud',
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://eka-dev.cloud',
        },
    },
})
