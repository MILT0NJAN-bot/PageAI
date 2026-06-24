// db/client.ts
// Construye DATABASE_URL desde variables individuales si no está definida.
// Esto permite usar el mismo .env que tenías en proyectos anteriores.
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Si DATABASE_URL no está definida explícitamente, la armamos aquí
// a partir de las variables individuales DB_HOST, DB_PORT, etc.
if (!process.env.DATABASE_URL) {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

  if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
    throw new Error(
      'Faltan variables de base de datos. Define DATABASE_URL o las variables ' +
      'DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME en tu .env'
    );
  }

  // Construye la URL en el formato que Prisma requiere
  process.env.DATABASE_URL =
    `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

  console.log(`[db] Conectando a: ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
