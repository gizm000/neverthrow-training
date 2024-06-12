import { err, ok } from "neverthrow";
import { v4 as uuid } from "uuid";
import { z } from "zod";

const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  authorId: z.string().uuid(),
});

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  authorId: z.string().uuid(),
});

export interface ICreatePostInput extends z.infer<typeof createPostSchema> {}

export class Post implements z.infer<typeof postSchema> {
  protected constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly authorId: string
  ) {}

  static create(input: ICreatePostInput) {
    return ok(input).andThen(() => {
      const post = new Post(uuid(), input.title, input.content, input.authorId);
      const parsed = postSchema.safeParse(post);
      if (!parsed.success) {
        return err(parsed.error);
      }
      return ok(post);
    });
  }
}
