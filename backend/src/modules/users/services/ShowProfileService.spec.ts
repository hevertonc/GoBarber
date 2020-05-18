import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show a user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Heverton Carneiro',
      email: 'heverton@fritecnologia.com.br',
      password: '1234567890',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Heverton Carneiro');
  });

  it('should not be able to show a user profile with an inexistent id', async () => {
    await expect(
      showProfile.execute({
        user_id: 'inexistent-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
