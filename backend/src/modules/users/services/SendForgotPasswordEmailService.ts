import { injectable, inject } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email address does not exist.');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail(
      {
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[GoBarber] Recuperação de Senha',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            link: `http://localhost:3000/reset_password?token=${token}`,
          },
        },
      },
      /*      email,
      `<h1>GoBarber</h1><br />
       <h3>Recuperação de senha</h3>
       <p>Uma recuperação de senha foi solicitada no App GoBarber.</p>
       <p>Este é o seu Token para alteração da senha: <strong>${token}</strong></p>
       <p>Este token tem validade de 2 horas, e após esse período, um novo token deve ser solicitado.</p>
       <p>Caso você não tenha feito esta solicitação, ignore este email.</p>`, */
    );
  }
}

export default SendForgotPasswordEmailService;
