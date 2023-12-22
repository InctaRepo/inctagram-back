import { Module } from '@nestjs/common';
import { PostController } from './api/post.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostCommandHandler } from './application/use-cases/commands/create-post.command.handler';
import { PostsRepository } from './infrastructure/posts.repository';
import { GetUsersPostsQueryHandler } from './application/use-cases/queries/get-users-posts-query.handler';
import { UserModule } from '../users/user.module';
import { DeletePostCommandHandler } from './application/use-cases/commands/delete-post.command.handler';
import { EditPostCommandHandler } from './application/use-cases/commands/edit-post.command.handler';
import { GetPostByIdQueryHandler } from './application/use-cases/queries/get-post-by-id.query.handler';
import { GetAllPostsQueryHandler } from './application/use-cases/queries/get-all-posts.query.handler';

const commandHandlers = [
  CreatePostCommandHandler,
  DeletePostCommandHandler,
  EditPostCommandHandler,
];
const queryHandlers = [
  GetUsersPostsQueryHandler,
  GetPostByIdQueryHandler,
  GetAllPostsQueryHandler,
];
@Module({
  imports: [CqrsModule, UserModule],
  providers: [...commandHandlers, ...queryHandlers, PostsRepository],
  controllers: [PostController],
})
export class PostsModule {}
