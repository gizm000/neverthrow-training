import { z } from "zod";
import { v4 as uuid } from "uuid";
import { err, ok } from "neverthrow";

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export interface ICreateUserInput extends z.infer<typeof createUserSchema> {}

export class User implements z.infer<typeof userSchema> {
  protected constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {}

  static create({ name, email }: ICreateUserInput) {
    return ok({ name, email }).andThen(() => {
      const user = new User(uuid(), name, email);
      const parsed = userSchema.safeParse(user);
      if (!parsed.success) {
        return err(parsed.error);
      }
      return ok(user);
    });
  }
}
