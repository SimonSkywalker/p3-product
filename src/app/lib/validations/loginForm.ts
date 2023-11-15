import { z } from 'zod'

export const loginFormSchema = z.object({
  username: z.string().regex(new RegExp(/^[a-zA-Z0-9]+$/),'Special characters not allowed').min(3).max(20).trim(),
  password: z.string().regex(new RegExp(/^[a-zA-Z0-9]+$/),'Special characters not allowed').min(5).max(24).trim(),
}) 