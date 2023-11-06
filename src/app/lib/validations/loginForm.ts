import { z } from 'zod'

export const loginFormSchema = z.object({
  username: z.string().min(3).max(20).trim(),
  password: z.string().min(5).max(24).trim(),
}) 