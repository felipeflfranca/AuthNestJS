import { PrismaClient } from '@prisma/client';
import { Role } from 'src/auth/enum/role.enum';

async function seed_1704597231709_user_admin(prisma: PrismaClient) {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@gmail.com',
        password:
          '$2b$10$YdT3KSSK7kS8W5cAgLZJvuJ2uZwfiYj14Plo2bJDx6.o5MXaVLUEu', //teste
      },
    });

    await prisma.role.create({
      data: {
        name: Role.Admin,
        userId: user.id,
      },
    });

    console.log('seed_1704597231709_user_admin inserted in the database');
    return 'continue';
  } catch (error) {
    console.error('Error during data seed_1704597231709_user_admin:', error);
    process.exit(1);
  }
}

export default seed_1704597231709_user_admin;
