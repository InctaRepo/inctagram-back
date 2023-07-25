import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../../../../core/adapters/mailer/mail.service';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCommandHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly authRepository: AuthRepository, // private passwordRecoveryRepo: PasswordRecoveryRepository,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: PasswordRecoveryCommand): Promise<boolean> {
    try {
      const { email } = command;
      // const userModel = await this.userQueryRepository.findUserByLoginOrEmail(
      //   email,
      // );
      // if (!userModel) {
      //   return false;
      // }
      const recoveryCode = uuidv4();
      await Promise.all([
        //this.passwordRecoveryRepo.create(passwordRecoveryEntity),
        this.emailService.sendEmail(
          email,
          'Password recovery email',
          'password-recovery',
          { recoveryCode },
        ),
      ]);
      console.log(`[mailService]: email has been sent`);
      return true;
    } catch (e) {
      console.error(`[mailService]: email sending error:`, e);
      return false;
    }
  }
}
