import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createApp } from '../app.js';

const prisma = new PrismaClient();
const app = createApp();

describe('Auth + Projects API', () => {
  const email = `test-${Date.now()}@pliego.app`;
  const password = 'testpass123';
  let agent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    agent = request.agent(app);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it('registers and returns session user', async () => {
    const res = await agent.post('/api/auth/register').send({
      name: 'Tester',
      email,
      password,
    });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(email);
  });

  it('creates and lists a project', async () => {
    const create = await agent.post('/api/projects').send({
      title: 'Proyecto test',
      width: 800,
      height: 1000,
      orientation: 'portrait',
    });
    expect(create.status).toBe(201);
    expect(create.body.project.title).toBe('Proyecto test');

    const list = await agent.get('/api/projects');
    expect(list.status).toBe(200);
    expect(list.body.projects.length).toBeGreaterThan(0);
  });

  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(401);
  });
});
