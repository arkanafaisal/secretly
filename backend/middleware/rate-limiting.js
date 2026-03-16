import redis from "../config/redis.js"
import {response} from "../utils/response.js"

const rl = {
    // --- AUTHENTICATION ROUTER ---
    register: { ttl: 60, limit: 10, increaseBy: 10 }, // Generous for typos. 1 successful account creation per hour.
    login: { ttl: 15, limit: 10, increaseBy: 10 }, // 10 attempts. Success fills the bucket to prevent rapid re-logins.
    logout: { ttl: 15, limit: 30 }, // No success penalty. Low risk.
    refresh: { ttl: 15, limit: 60 }, // Generous for background token refreshing.
    verifyEmail: { ttl: 60, limit: 10, increaseBy: 10 }, // 10 attempts for mistyped codes. 1 success per hour.
    resetPassword: { ttl: 60, limit: 10, increaseBy: 10 }, // 10 attempts for mistyped passwords. 1 success per hour.

    // --- MESSAGES ROUTER ---
    getMyMessages: { ttl: 1, limit: 60 }, // 60 per minute. Allows rapid inbox polling/refreshing.
    createMessage: { ttl: 10, limit: 20, increaseBy: 5 }, // Allows a few failed validations. Success +5 (max ~4 messages per 10 mins).
    changeMessageProperties: { ttl: 1, limit: 30 }, // No strict success penalty. User might rapidly pin/read multiple messages.
    deleteMessage: { ttl: 1, limit: 30 }, // Allows clearing out the inbox smoothly.

    // --- USERS ROUTER ---
    getMyProfile: { ttl: 1, limit: 60 }, // High limit for UI navigation.
    getProfile: { ttl: 1, limit: 60 }, // High limit for viewing public profiles.

    refreshPublicId: { ttl: 60, limit: 5, increaseBy: 5 }, // 1 successful link refresh per hour to prevent DB churn.

    // Completely separated profile updates
    updateUsername: { ttl: 60, limit: 10, increaseBy: 10 }, // Rare action. 1 success per hour to prevent name squatting/confusion.
    updatePassword: { ttl: 60, limit: 5, increaseBy: 5 }, // Security sensitive. 1 success per hour.
    updateBio: { ttl: 15, limit: 20, increaseBy: 5 }, // Moderate. Users might tweak bio a few times before being satisfied.
    updateAvatarIndex: { ttl: 5, limit: 40, increaseBy: 2 }, // Very lenient. Users rapidly click through avatars to preview them.
    toggleAllowMessages: { ttl: 5, limit: 20, increaseBy: 5 }, // Users might toggle this on/off to test their public link.

    sendEmailVerification: { ttl: 60, limit: 5, increaseBy: 5 }, // Strict. 1 success per hour to prevent third-party email spam.
    sendResetPassword: { ttl: 60, limit: 5, increaseBy: 5 }, // Strict. 1 success per hour to prevent inbox bombing.
}

export default function rateLimiting(feature){
    return async function(req, res, next){
        try {
            const count = await incrbyRateLimit(feature, req.ip, 1)
            
            if (count > rl[feature].limit) {
            return response(res, false, 429, "too many requests")
            }

            next()
        } catch (error) {
            console.log(error)
            next()
        }
    }
}

export async function incrbyRateLimit(feature, ip, incr = null){
    const key = "secretly:rl:" + feature + ":" + ip
        
    incr = incr || rl[feature].increaseBy
    const windowMs = rl[feature].ttl * 60000

    const count = await redis.eval(
        `
        local current = redis.call("INCRBY", KEYS[1], ARGV[1])
        if current == tonumber(ARGV[1]) then
            redis.call("PEXPIRE", KEYS[1], ARGV[2])
        end
        return current
        `,
        {
            keys: [key],
            arguments: [incr.toString() ,windowMs.toString()]
        }
    )
    return count
}