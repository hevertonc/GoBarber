import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    await fakeUsersRepository.create({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    const response = await authenticateUser.execute({
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with inexistent user', async () => {
    await fakeUsersRepository.create({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    await expect(
      authenticateUser.execute({
        email: 'heverton@fritecnologia.com',
        password: '1234567890',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with existent user and wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    await expect(
      authenticateUser.execute({
        email: 'heverton@fritecnologia.com.br',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
