import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('Role Update (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let userId: string;
  let adminEmail: string;
  let userEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);

    // 1. Setup Admin
    adminEmail = `admin_role_${Date.now()}@test.com`;
    const adminRes = await request(app.getHttpServer())
      .post('/users')
      .send({ email: adminEmail, password: 'password', name: 'Admin' })
      .expect(201);
    const adminId = adminRes.body.id;

    // Manually set role to admin in DB since registration defaults to user
    await dataSource.query(
      `UPDATE user SET role = 'admin' WHERE id = '${adminId}'`,
    );

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password: 'password' });
    adminToken = adminLogin.body.access_token;

    // 2. Setup User
    userEmail = `user_role_${Date.now()}@test.com`;
    const userRes = await request(app.getHttpServer())
      .post('/users')
      .send({ email: userEmail, password: 'password', name: 'User' })
      .expect(201);
    userId = userRes.body.id;

    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password: 'password' });
    userToken = userLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. User should not be able to access admin endpoint initially', async () => {
    // /users is admin only
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('2. Admin should be able to promote User to Admin', async () => {
    await request(app.getHttpServer())
      .patch(`/users/${userId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'admin' })
      .expect(200);
  });

  it('3. Promoted User should be able to access admin endpoint', async () => {
    // Role is fetched from DB on each request by JwtStrategy, so no need to relogin
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
  });

  it('4. Admin should be able to demote User back to User', async () => {
    await request(app.getHttpServer())
      .patch(`/users/${userId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'user' })
      .expect(200);
  });

  it('5. Demoted User should not be able to access admin endpoint', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
