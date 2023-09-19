import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileStorageService } from '../../../infrastructure/file-storage.service';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { FileUploadUserAvatar } from '../../../../../../../../libs/contracts/file/file.upload-user-avatar';

export class UploadAvatarCommand {
  constructor(readonly userId: string, readonly file: Express.Multer.File) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarCommandHandler
  implements ICommandHandler<UploadAvatarCommand>
{
  constructor(private awsService: FileStorageService) {}

  async execute(
    command: UploadAvatarCommand,
  ): Promise<NotificationResult<FileUploadUserAvatar.Response>> {
    const resultUploadFile = await this.awsService.uploadUserAvatar(
      Buffer.from(command.file.buffer['data'] as Buffer),
      command.file.originalname,
      command.file.mimetype,
      command.userId,
    );
    return resultUploadFile;
  }
}
