import { err, fromSafePromise, ok } from "neverthrow";
import {
  ICreatePostInput,
  Post,
  createPostSchema,
} from "../entities/post.entity";
import { PostRepository } from "../repositories/post.repository";
import { UserRepository } from "../repositories/user.repository";

interface Input extends ICreatePostInput {}

export class CreatePostCommand {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository
  ) {}

  public execute(input: Input) {
    return ok(input)
      .andThen(this.validate.bind(this))
      .andThen(this.toEntity.bind(this))
      .asyncAndThen(this.save.bind(this));
  }

  private validate(input: Input) {
    return ok(input).andThen(() => {
      const result = createPostSchema.safeParse(input);
      if (!result.success) {
        return err(result.error);
      }
      return ok(input);
    });
  }

  private toEntity(input: Input) {
    const post = Post.create(input);
    return post;
  }

  private save(post: Post) {
    return fromSafePromise(this.postRepository.save(post));
  }
}
