import {initPostgres} from '~~/server/db/postgres'
import {initRedis} from '~~/server/db/redis'

export default defineNitroPlugin(async () => {
    await Promise.all([
        initPostgres(),
        initRedis(),
    ])
})
