#!/bin/sh
echo "⚙️  Starting Auth Service"
npm run prisma:generate
npm run prisma:sync
npm run prisma:seed
npm run start:dev