import { envSchema } from "@/config/env/schema"

type Config = {
    env: typeof env.NODE_ENV
    isProduction: boolean
    api: {
        interestRateUrl: string
    }
}

function validateEnv() {
    const parsed = envSchema.safeParse(process.env)

    if (!parsed.success) {
        console.error('❌ Invalid environment variables:', parsed.error.format())
        throw new Error('Invalid environment variables')
    }
    return parsed.data
}

export const env = validateEnv()

export const config: Config = {
    env: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    api: {
        interestRateUrl: env.INTEREST_RATE_API_URL
    }
} as const