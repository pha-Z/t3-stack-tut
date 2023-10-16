import { z } from "zod";
export const postContentSchema = z.object({
  content: z
    .string()
    .min(1, "too short!")
    .max(280, "too long!")
    // check for `emoji` or `emoji ` https://regexper.com/#%2F%5E%28%5Cp%7BEmoji%7D%7C%28%5Cp%7BEmoji%7D%5Cs%29%29%2B%24%2Fu
    .regex(/^(\p{Emoji}|(\p{Emoji}\s))+$/u, {
      message: "use emojis only!",
    })
    // check that every array element (split at whitespace) is not a number (NaN)
    // required because integer numbers bypass emoji regex 🥴
    .refine(
      (content: string) =>
        content
          .split(" ")
          .map((el) => parseInt(el))
          .every(isNaN),
      { message: "use emojis only!" },
    ),
});
