// tests/setup.ts
import { PrismaClient } from '@prisma/client';
import express, { Application } from 'express';
import createExpressApp from '../src/app';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the test-specific .env file
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

// console.log('DATABASE_URL from env:', process.env.DATABASE_URL);

let testClient: PrismaClient;
let testApp: Application;

beforeAll(async () => {
  try {
    // Set longer timeout for the setup
    jest.setTimeout(60000);

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set in .env.test');
    }

    // Initialize Prisma client
    testClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['error', 'warn'],
    });

    // Verify database connection
    await testClient.$connect();

    // Initialize Express app
    testApp = express();
    testApp = await createExpressApp(testApp);
  } catch (error) {
    console.error('Error during test setup:', error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    // Clean all tables before each test
    const tablenames = await testClient.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        await testClient.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
        );
      }
    }
  } catch (error) {
    console.error('Error during test cleanup:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await testClient.$disconnect();
  } catch (error) {
    console.error('Error during test teardown:', error);
    throw error;
  }
});

export { testClient, testApp };
