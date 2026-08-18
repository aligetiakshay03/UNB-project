import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: 'admin@unb.co.za' } });
  const editor = await prisma.user.findUnique({ where: { email: 'editor@unb.co.za' } });

  const adminPassValid = admin ? await bcrypt.compare('admin123!', admin.passwordHash) : false;
  const editorPassValid = editor ? await bcrypt.compare('editor123!', editor.passwordHash) : false;

  console.log('ADMIN check (admin@unb.co.za / admin123!):', adminPassValid);
  console.log('EDITOR check (editor@unb.co.za / editor123!):', editorPassValid);

  await prisma.$disconnect();
}

main();
