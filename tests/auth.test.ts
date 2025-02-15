import request from 'supertest';
import { testApp, testClient } from './setup';

describe('POST /auth/signup', () => {
  // jest.setTimeout(30000);
  // beforeEach(async () => {
  //   await testClient.user.deleteMany();
  // });

  it('should register a new user', async () => {
    const response = await request(testApp).post('/auth/signup').send({
      emailAddress: 'test@mail.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
    });

    expect(response.status).toBe(201);
  });

  it('should return 409 if email is invalid', async () => {
    const response = await request(testApp).post('/auth/signup').send({
      emailAddress: 'testmail.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
    });

    expect(response.status).toBe(409);
  });
});
