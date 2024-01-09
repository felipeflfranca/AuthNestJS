import * as fs from 'fs';
import * as path from 'path';

const seedsDir = path.join(__dirname, '..', 'seeds');
const timestamp = Date.now();

const name = process.argv[2] ?? 'seed';
const seedName = `seed_${timestamp}_${name}`;

const seedContent = `
import { PrismaClient } from '@prisma/client';

async function ${seedName}(prisma: PrismaClient) {
  try {
    // Implement your seed logic here

    console.log('${seedName} inserted in the database');
    return 'continue'
  } catch (error) {
    console.error('Error during data ${seedName}:', error);
    process.exit(1);
  }
}

export default ${seedName};

`;

const seedFilePath = path.join(seedsDir, `${seedName}.ts`);

fs.writeFileSync(seedFilePath, seedContent);

console.log(`Seed ${seedName} created successfully.`);
