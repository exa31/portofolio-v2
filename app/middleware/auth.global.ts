export default defineNuxtRouteMiddleware(async (to, from) => {
    // Skip auth check for non-dashboard routes
    if (!to.path.startsWith('/dashboard')) {
        return;
    }

    // Use useCookie for consistent cookie handling across client and server
    const token = useCookie('token', {
        maxAge: 86400, // 1 day
        path: '/',
        sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
        secure: process.env.NODE_ENV === 'production',
    });

    // If no token, redirect to login
    if (!token.value) {
        return navigateTo('/login');
    }
})
