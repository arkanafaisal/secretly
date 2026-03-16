import redis from "../config/redis.js"


const redisType = {
    "tokens": {prefix: 'secretly:tokens:', ttl: 60 * 60 * 168},
    "email-verify": {prefix: 'secretly:email-verify:', ttl: 60 * 60 * 24 },
    "reset-password": {prefix: 'secretly:reset-password:', ttl: 60 * 30 },
    
    "profile": { prefix: 'secretly:cache:profile:', ttl: 60 * 15 },
    "publicProfile": { prefix: 'secretly:cache:publicProfile:', ttl: 60 * 15 },
    "messages": { prefix: 'secretly:cache:messages:', ttl: 60 * 60 * 5 },
}


export async function get(type, key){
    try {
        const rawData = await redis.get(redisType[type].prefix + key)
        if(!rawData){return {ok: false}}
        return {ok: true, data: JSON.parse(rawData)}
    } catch(err) {
        console.error("Redis GET error:", err.message)
        return {ok: false} 
    }
}

export async function set(type, key, data){
    try {
        await redis.set(redisType[type].prefix + key, JSON.stringify(data), {"EX": redisType[type].ttl})
        return {ok: true} 
    } catch (err) {
        console.error("Redis SET error:", err.message)
        return {ok: false}
    }
}

export async function del(type, key){
    try {
        await redis.del(redisType[type].prefix + key)
        return {ok: true} 
    } catch (err) {
        console.error("Redis DEL error:", err.message)
        return {ok: false}
    }
}

// export async function delPattern(type, key) {
//     const keys = await redis.keys(`${redisType[type].prefix}:${key}:*`)
//     if (keys.length) await redis.del(...keys)
// }

export async function delPattern(type, key) {
    const pattern = `${redisType[type].prefix}:${key}:*`
    let cursor = '0'

    do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
        cursor = nextCursor

        if (keys.length) {
            await redis.del(...keys)
        }
    } while (cursor !== '0')
}