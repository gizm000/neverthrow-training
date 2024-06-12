import {
  ICreateUserInput,
  User,
  createUserSchema,
} from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { err, fromSafePromise, ok } from "neverthrow";

interface Input extends ICreateUserInput {}

export class CreateUserCommand {
  constructor(private readonly userRepository: UserRepository) {}

  public execute(input: Input) {
    return ok(input)
      .andThen(this.validate.bind(this))
      .andThen(this.toEntity.bind(this))
      .asyncAndThen(this.save.bind(this));
  }

  private validate(input: Input) {
    return ok(input).andThen(() => {
      const result = createUserSchema.safeParse(input);
      if (!result.success) {
        return err(result.error);
      }
      return ok(input);
    });
  }

  private toEntity(input: Input) {
    const user = User.create(input);
    return user;
  }

  private save(user: User) {
    return fromSafePromise(this.userRepository.save(user));
  }
}
