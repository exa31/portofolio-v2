export default defineEventHandler((event) => {
    // Minimal request logger that logs method, route, status and duration (on response finish)
    const start = Date.now()
    const method = typeof getMethod === 'function' ? getMethod(event) : (event.node?.req?.method ?? 'UNKNOWN')
    const url = typeof getRequestURL === 'function' ? getRequestURL(event) : (event.node?.req?.url ?? 'UNKNOWN')

    const res = event.node?.res


    if (res && typeof res.on === 'function') {
        res.on('finish', () => {
            const duration = Date.now() - start
            // statusCode is not typed on H3's response, so cast to any
            const status = (res as any).statusCode ?? 'unknown'
            logger.info(`${method} ${url} ${status} - ${duration}ms`)
        })
    } else {
        // Fallback: if we can't attach a listener, log the request line immediately
        logger.info(`${method} ${url}`)
    }
})