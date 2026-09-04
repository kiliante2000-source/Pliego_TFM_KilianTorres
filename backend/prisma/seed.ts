import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { createEmptyDocument } from '../src/types/document.js';
import { templates } from '../src/services/templateService.js';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('demo1234', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@pliego.app' },
    update: {},
    create: {
      name: 'Demo Editorial',
      email: 'demo@pliego.app',
      passwordHash,
      role: 'user',
    },
  });

  const existing = await prisma.project.count({ where: { ownerId: user.id } });
  if (existing === 0) {
    const template = templates[0];
    const doc = template.build();
    await prisma.project.create({
      data: {
        ownerId: user.id,
        title: 'Portada demo',
        slug: 'portada-demo-pliego',
        width: template.width,
        height: template.height,
        orientation: template.orientation,
        documentJson: JSON.stringify(doc),
        visibility: 'public',
        published: true,
      },
    });

    await prisma.project.create({
      data: {
        ownerId: user.id,
        title: 'Borrador vacío',
        slug: 'borrador-vacio-pliego',
        width: 1080,
        height: 1350,
        orientation: 'portrait',
        documentJson: JSON.stringify(createEmptyDocument('Borrador vacío', 1080, 1350)),
      },
    });
  }

  console.log('Seed OK — demo@pliego.app / demo1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
