import { z } from "zod";
export const postContentSchema = z.object({
  content: z
    .string()
    .regex(/^(\p{Emoji}|(\p{Emoji}\s))+$/u, {
      message: "use emojis only!",
    })
    .min(1)
    .max(280),
});
