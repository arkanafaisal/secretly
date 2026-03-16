import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

// Inisialisasi adapter dengan URL dari environment
const adapter = new PrismaPg({ 
    connectionString: process.env.DATABASE_URL 
});

// Masukkan adapter ke dalam argumen PrismaClient
const prisma = new PrismaClient({ adapter });

export default prisma;