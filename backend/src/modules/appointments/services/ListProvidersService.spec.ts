import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers except logged user', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@teste.com.br',
      password: '1234567890',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'User 2',
      email: 'user2@teste.com.br',
      password: '1234567890',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'User 3',
      email: 'user3@teste.com.br',
      password: '1234567890',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers.length).toBe(2);
    expect(providers).toEqual([user1, user2]);
  });

  /*  it('should be able to list all providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@teste.com.br',
      password: '1234567890',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'User 2',
      email: 'user2@teste.com.br',
      password: '1234567890',
    });

    const user3 = await fakeUsersRepository.create({
      name: 'User 3',
      email: 'user3@teste.com.br',
      password: '1234567890',
    });

    const providers = await listProviders.execute({});

    expect(providers.length).toBe(3);
    expect(providers).toBe([user1, user2, user3]);
  }); */
});
