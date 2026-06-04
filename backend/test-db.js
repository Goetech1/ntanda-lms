const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$connect()
    .then(() => {
        console.log('DATABASE_CONNECTION_OK');
        process.exit(0);
    })
    .catch((e) => {
        console.error('DATABASE_CONNECTION_ERROR', e);
        process.exit(1);
    });
