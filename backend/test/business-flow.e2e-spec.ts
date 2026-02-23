import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('Business Flow (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  let adminToken: string;
  let userToken: string;
  let assetId: string;

  it('1. Register and Setup Admin', async () => {
    const email = `admin_${Date.now()}@test.com`;
    // Register
    await request(app.getHttpServer())
      .post('/users')
      .send({ email, password: 'password', name: 'Admin' })
      .expect(201);

    // Update Role directly
    await dataSource.query(
      `UPDATE user SET role = 'admin' WHERE email = '${email}'`,
    );

    // Login
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password' })
      .expect(201);

    adminToken = res.body.access_token;
    expect(adminToken).toBeDefined();
  });

  it('2. Register and Login User', async () => {
    const email = `user_${Date.now()}@test.com`;
    await request(app.getHttpServer())
      .post('/users')
      .send({ email, password: 'password', name: 'User' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password' })
      .expect(201);

    userToken = res.body.access_token;
    expect(userToken).toBeDefined();
  });

  it('3. User Deposits Money', async () => {
    const res = await request(app.getHttpServer())
      .post('/wallet/deposit')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 1000 })
      .expect(201);

    expect(Number(res.body.newBalance)).toBe(1000);
  });

  it('4. Admin Creates Asset', async () => {
    const res = await request(app.getHttpServer())
      .post('/assets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Gold',
        description: 'Gold Bar',
        totalSupply: 100,
        referenceValue: 10,
      })
      .expect(201);

    assetId = res.body.id;
    expect(assetId).toBeDefined();
  });

  it('5. User Buys Asset', async () => {
    await request(app.getHttpServer())
      .post(`/assets/${assetId}/buy`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 10 })
      .expect(201); // 10 * 10 = 100 cost

    // Check Balance (Should be 900)
    const balRes = await request(app.getHttpServer())
      .get('/wallet/balance')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Number(balRes.body.balance)).toBe(900);

    // Check Assets
    const assetsRes = await request(app.getHttpServer())
      .get('/assets/my')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    const myAsset = assetsRes.body.find((a: any) => a.asset.id === assetId);
    expect(myAsset).toBeDefined();
    expect(myAsset.amount).toBe(10);
  });

  it('6. User Mints NFT', async () => {
    const res = await request(app.getHttpServer())
      .post('/nfts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'My Sword',
        description: 'Rare item',
        metadata: { power: 9000 },
      })
      .expect(201);

    expect(res.body.blockchainHash).toBeDefined();

    // Verify ownership
    const myNfts = await request(app.getHttpServer())
      .get('/nfts/my')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(myNfts.body.length).toBeGreaterThan(0);
    expect(myNfts.body[0].name).toBe('My Sword');
  });

  it('7. Validate Blockchain', async () => {
    const res = await request(app.getHttpServer())
      .get('/blockchain/valid')
      .set('Authorization', `Bearer ${userToken}`) // Any user can check
      .expect(200);

    expect(res.text).toBe('true');
  });
});
