import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../../users/domain/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { SignUpDto } from '../../dto/request/sign-up.dto';
import {
  BadResult,
  NotificationResult,
  SuccessResult,
} from '../../../../../core/common/notification/notification-result';

export class SignupCommand {
  constructor(public readonly signupDto: SignUpDto) {}
}

@CommandHandler(SignupCommand)
export class SignupCommandHandler implements ICommandHandler<SignupCommand> {
  constructor(
    private authRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: SignupCommand): Promise<NotificationResult> {
    const [userByEmail, userByUsername] = await Promise.all([
      this.authRepository.findByEmail(command.signupDto.email),
      this.authRepository.findByUsername(command.signupDto.username),
    ]);

    if (userByEmail || userByUsername) {
      return new BadResult(
        'User with this email or username is already registered',
        'email or username',
      );
    }

    const passwordHash = bcrypt.hashSync(command.signupDto.password, 10); //TODO env

    const user = UserEntity.create(
      command.signupDto.username,
      command.signupDto.email,
      passwordHash,
    );

    await this.authRepository.create(user);

    user.getUncommittedEvents().forEach((event) => {
      this.eventBus.publish(event);
    });
    return new SuccessResult({ email: user.email });
  }
}
