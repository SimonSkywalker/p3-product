import { z } from 'zod'

/**
 * Schema checks for special characters, min/max length and trims whitespace
 **/
export const validateProjectData = z.object({
  title: z.string().regex(new RegExp(/^[a-zA-Z0-9]+$/),'Special characters not allowed').min(1).max(20).trim(),
}) 