import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('heverton@fritecnologia.com.br');
  });

  it('should not be able to create two users with the same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    await expect(
      createUser.execute({
        name: 'Heverton Carneiro',
        email: 'heverton@fritecnologia.com.br',
        password: '1234567890',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
