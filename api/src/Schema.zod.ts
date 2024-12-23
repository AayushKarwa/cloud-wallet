import {string, z} from 'zod'

export const signUpSchema = z.object({

    username: z.string().min(4).max(20),
    password: string().min(4).max(16),
    
})



