import { PrismaClient } from "@prisma/client";
import { Post } from "../entities/post.entity";

export class PostRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByAuthor({ authorId }: { authorId: string }) {
    return this.prisma.user
      .findUniqueOrThrow({
        where: {
          id: authorId,
        },
      })
      .posts();
  }

  async save(post: Post) {
    return this.prisma.post.upsert({
      where: {
        id: post.id,
      },
      create: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
      },
      update: {
        title: post.title,
        content: post.content,
      },
    });
  }
}
