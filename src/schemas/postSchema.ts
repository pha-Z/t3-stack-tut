import { z } from "zod";
export const postContentSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(280)
    .regex(/^(\p{Emoji}|(\p{Emoji}\s))+$/u, {
      message: "use emojis only!",
    })
    .refine(
      (content: string) =>
        content
          .split(" ")
          .map((x) => parseInt(x))
          .every(isNaN),
      { message: "use emojis only!" },
    ),
});
