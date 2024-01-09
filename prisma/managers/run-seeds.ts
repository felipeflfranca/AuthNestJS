import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Starting seed planting');

    const seedsDir = path.join(__dirname, '..', 'seeds');
    const files = fs.readdirSync(seedsDir);

    for (const file of files.sort()) {
      if (file.endsWith('.ts')) {
        const seedFile = file.replace('.ts', '');

        const existingSeed = await prisma.prismaSeeds.findFirst({
          where: {
            name: seedFile,
            executed: true,
          },
        });

        if (!existingSeed) {
          const seedPath = path.join(seedsDir, file);
          const seed = await import(seedPath).then((module) => module.default);

          if (typeof seed === 'function') {
            const result = await seed(prisma);

            if (result === 'continue') {
              await prisma.prismaSeeds.create({
                data: {
                  name: seedFile,
                  executed: true,
                },
              });

              continue;
            }
          }
        } else {
          console.log(`Seed ${seedFile} already executed`);
        }
      }
    }

    console.log('🌱 Completed seed planting');
  } catch (error) {
    console.error('Error during data seeds:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData().catch((error) => {
  console.error('Error during data seeds:', error);
  process.exit(1);
});
