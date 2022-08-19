import {
  CreateTweetInput,
  createTweetInputSchema,
} from "@/components/tweet/validator/types";

export class TweetValidator {
  public static validateTweetBody(body: unknown): CreateTweetInput {
    const result = createTweetInputSchema.safeParse(body);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return result.data;
  }
}
