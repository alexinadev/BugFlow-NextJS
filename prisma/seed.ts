import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!

console.log('DATABASE_URL:', connectionString ? 'Found' : 'Missing')

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { phone: '09123456789' },
    update: {},
    create: {
      name: 'Admin User',
      phone: '09123456789',
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  console.log('Created admin user:', admin)

  // Create regular user
  const user = await prisma.user.upsert({
    where: { phone: '09987654321' },
    update: {},
    create: {
      name: 'Regular User',
      phone: '09987654321',
      password: userPassword,
      role: Role.USER,
    },
  })

  console.log('Created regular user:', user)
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })