import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const p1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Mì gói Hảo Hảo',
      price: 5000,
      stock: 50,
    },
  })

  const p2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Sữa tươi Vinamilk',
      price: 12000,
      stock: 20,
    },
  })

  console.log({ p1, p2 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
