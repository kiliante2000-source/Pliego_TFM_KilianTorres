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

  const template =
    templates.find((t) => t.id === 'portada-editorial') ?? templates[0];
  const brandedDoc = template.build();
  brandedDoc.meta.title = 'Portada demo';
  brandedDoc.meta.templateId = template.id;
  brandedDoc.meta.templateName = template.name;

  await prisma.project.upsert({
    where: { slug: 'portada-demo-pliego' },
    update: {
      title: 'Portada demo',
      width: template.width,
      height: template.height,
      orientation: template.orientation,
      documentJson: JSON.stringify(brandedDoc),
      visibility: 'public',
      published: true,
      status: 'active',
      ownerId: user.id,
    },
    create: {
      ownerId: user.id,
      title: 'Portada demo',
      slug: 'portada-demo-pliego',
      width: template.width,
      height: template.height,
      orientation: template.orientation,
      documentJson: JSON.stringify(brandedDoc),
      visibility: 'public',
      published: true,
    },
  });

  const blank = await prisma.project.findFirst({
    where: { slug: 'borrador-vacio-pliego' },
  });
  if (!blank) {
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

  console.log('Seed OK — demo@pliego.app / demo1234 (plantillas marca PLIEGO)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
