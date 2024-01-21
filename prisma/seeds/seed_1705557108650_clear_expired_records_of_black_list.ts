import { PrismaClient } from '@prisma/client';

async function seed_1705557108650_clear_expired_records_of_black_list(
  prisma: PrismaClient,
) {
  try {
    await prisma.$executeRaw`CREATE OR REPLACE FUNCTION clear_expired_records_of_black_list()
      RETURNS TRIGGER AS $$
      BEGIN
        DELETE FROM public.black_list
        WHERE expires_in < NOW();
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;`;

    await prisma.$executeRaw`CREATE TRIGGER clear_registrations_of_black_list_trigger
      AFTER INSERT 
      ON public.black_list
      FOR EACH ROW
      EXECUTE FUNCTION clear_expired_records_of_black_list();`;

    console.log(
      'seed_1705557108650_clear_expired_records_of_black_list inserted in the database',
    );
    return 'continue';
  } catch (error) {
    console.error(
      'Error during data seed_1705557108650_clear_expired_records_of_black_list:',
      error,
    );
    process.exit(1);
  }
}

export default seed_1705557108650_clear_expired_records_of_black_list;
