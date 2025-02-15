import request from 'supertest';
import { testApp, testClient } from './setup';

describe('POST /users', () => {
  // jest.setTimeout(30000);
  // beforeEach(async () => {
  //   await testClient.user.deleteMany();
  // });

  it('should get me', async () => {
    await request(testApp).get('/user/me').expect(401);
  });
});
