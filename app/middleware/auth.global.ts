export default defineNuxtRouteMiddleware(async (to, from) => {
        let token;
        if (import.meta.server) {
            const headers = useRequestHeaders(['cookie'])
            token = headers.cookie
                ? headers.cookie.replace(
                    /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                    '$1'
                )
                : null;
        } else {
            token = useCookie('token').value;
        }
        if (!token && to.path.startsWith('/dashboard')) {
            return navigateTo('/login');
        }
    }
)