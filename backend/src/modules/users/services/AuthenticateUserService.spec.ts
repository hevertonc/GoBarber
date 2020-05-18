import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
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
