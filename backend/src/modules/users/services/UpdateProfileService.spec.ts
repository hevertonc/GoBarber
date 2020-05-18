import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update a user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Heverton Updated',
      email: 'heverton@updated.com.br',
    });

    expect(updatedUser.name).toBe('Heverton Updated');
    expect(updatedUser.email).toBe('heverton@updated.com.br');
  });

  it('should not be able to update a user profile with an inexistent id', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'inexistent-id',
        name: 'Heverton Updated',
        email: 'heverton@fritecnologia.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user profile to a existent email', async () => {
    await fakeUsersRepository.create({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    const user = await fakeUsersRepository.create({
      name: 'Heverton Carneiro 2',
      email: 'heverton2@fritecnologia.com.br',
      password: '1234567890',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Heverton Updated',
        email: 'heverton@fritecnologia.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Heverton Updated',
      email: 'heverton@updated.com.br',
      old_password: '1234567890',
      password: '0987654321',
    });

    expect(updatedUser.password).toBe('0987654321');
  });

  it('should not be able to update a user password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Heverton Updated',
        email: 'heverton@updated.com.br',
        password: '0987654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Heverton Updated',
        email: 'heverton@updated.com.br',
        old_password: '123456789',
        password: '0987654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
