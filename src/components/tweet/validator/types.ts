import * as z from "zod";

export const createTweetInputSchema = z.object({
  content: z
    .string()
    .min(1, "Please enter a valid tweet")
    .max(145, "Please enter a valid tweet"),
});
export type CreateTweetInput = {
  content: string;
};
