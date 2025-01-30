import { z } from 'zod'

export const envSchema = z.object({
    INTEREST_RATE_API_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'production', 'test']),
})

export type Env = z.infer<typeof envSchema>

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema> { }
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

// Create a strongly-typed config object
export const env = validateEnv()

// Type helper for config object
type Config = {
    env: typeof env.NODE_ENV
    isProduction: boolean
    api: {
        interestRateUrl: string
    }
}

// Export the config object with specific structure
export const config: Config = {
    env: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    api: {
        interestRateUrl: env.INTEREST_RATE_API_URL
    }
} as const