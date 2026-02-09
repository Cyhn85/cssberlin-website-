
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // VERITABANI TEMİZLİĞİ
    try {
        await prisma.review.deleteMany().catch(() => { })
        await prisma.notification.deleteMany().catch(() => { })
        await prisma.message.deleteMany().catch(() => { })
        await prisma.chat.deleteMany().catch(() => { })
        await prisma.favorite.deleteMany().catch(() => { })
        await prisma.productImage.deleteMany().catch(() => { })
        await prisma.product.deleteMany().catch(() => { })
        await prisma.transaction.deleteMany().catch(() => { })
        await prisma.wallet.deleteMany().catch(() => { })
        await prisma.follows.deleteMany().catch(() => { })
        await prisma.category.deleteMany().catch(() => { })
        await prisma.user.deleteMany().catch(() => { })
        console.log('🗑️  Database cleared.')
    } catch (e) {
        console.log('⚠️  Database clear skipped (empty tables?)')
    }

    // KULLANICILAR
    const seller = await prisma.user.create({
        data: {
            clerkId: 'demo_seller_anna_001',
            email: 'anna.mueller@cssberlin.de',
            username: 'anna_vintage',
            firstName: 'Anna',
            lastName: 'Müller',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            bio: 'Vintage-Liebhaberin aus Berlin Mitte. Qualität und Stil sind meine Leidenschaft! 🌿✨',
            location: 'Berlin, Mitte',
            isVerified: true,
            isAdmin: false,
        },
    })

    const buyer = await prisma.user.create({
        data: {
            clerkId: 'demo_buyer_max_002',
            email: 'max.schmidt@cssberlin.de',
            username: 'max_berlin',
            firstName: 'Max',
            lastName: 'Schmidt',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            bio: 'Auf der Suche nach coolen Streetwear-Pieces. 🔥',
            location: 'Berlin, Kreuzberg',
            isVerified: false,
            isAdmin: false,
        },
    })

    console.log('👥 Users created.')

    // KATEGORİLER
    const categoryDamen = await prisma.category.create({
        data: { name: 'Damen', slug: 'damen' },
    })
    const categoryHerren = await prisma.category.create({
        data: { name: 'Herren', slug: 'herren' },
    })
    const categorySchuhe = await prisma.category.create({
        data: { name: 'Schuhe', slug: 'schuhe' },
    })

    console.log('📂 Categories created.')

    // ÜRÜNLER
    const products = [
        // DAMEN
        {
            sellerId: seller.id,
            categoryId: categoryDamen.id,
            title: 'Zara Blazer Oversized - Beige',
            description: 'Eleganter Oversized-Blazer von Zara in zeitlosem Beige. Ungetragen mit Etikett! Passt perfekt zu Jeans oder als Office-Look.',
            price: 49.00,
            brand: 'Zara',
            size: 'M',
            color: 'Beige',
            condition: 'NEW_WITH_TAGS',
            images: ['https://picsum.photos/seed/blazer1/800/1000', 'https://picsum.photos/seed/blazer2/800/1000'],
        },
        {
            sellerId: seller.id,
            categoryId: categoryDamen.id,
            title: "Vintage Seidenbluse - Cremeweiß",
            description: "Wunderschöne Vintage-Seidenbluse aus den 90ern. Sehr gepflegter Zustand. 100% Seide - fühlt sich himmlisch an!",
            price: 35.00,
            brand: "Vintage",
            size: "S",
            color: "Weiß",
            condition: "VERY_GOOD",
            images: [
                "https://picsum.photos/seed/bluse1/800/1000"
            ]
        },
        {
            sellerId: seller.id,
            categoryId: categoryDamen.id,
            title: "H&M Premium Wollmantel - Schwarz",
            description: "Klassischer schwarzer Wollmantel von H&M Premium. Warm und elegant. Perfekt für den Berliner Winter!",
            price: 75.00,
            brand: "H&M",
            size: "L",
            color: "Schwarz",
            condition: "GOOD",
            images: [
                "https://picsum.photos/seed/mantel1/800/1000",
                "https://picsum.photos/seed/mantel2/800/1000"
            ]
        },
        {
            sellerId: seller.id,
            categoryId: categoryDamen.id,
            title: "Mango Midikleid - Blumenmuster",
            description: "Romantisches Midikleid mit Blumenmuster. Fließender Stoff, perfekt für Frühling und Sommer. Einmal getragen.",
            price: 38.00,
            brand: "Mango",
            size: "36",
            color: "Bunt",
            condition: "VERY_GOOD",
            images: [
                "https://picsum.photos/seed/kleid1/800/1000"
            ]
        },
        {
            sellerId: seller.id,
            categoryId: categoryDamen.id,
            title: "Levi's 501 High Waist Jeans",
            description: "Original Levi's 501 in perfekter Vintage-Waschung. High Waist Fit. Ein zeitloser Klassiker!",
            price: 55.00,
            brand: "Levi's",
            size: "W28/L32",
            color: "Blau",
            condition: "GOOD",
            images: [
                "https://picsum.photos/seed/jeans1/800/1000",
                "https://picsum.photos/seed/jeans2/800/1000"
            ]
        },
        // HERREN (3 ürün)
        {
            sellerId: seller.id,
            categoryId: categoryHerren.id,
            title: "Nike Tech Fleece Hoodie - Grau",
            description: "Original Nike Tech Fleece Hoodie in Grau Melange. Super bequem und warm. Größe entspricht normal.",
            price: 65.00,
            brand: "Nike",
            size: "L",
            color: "Grau",
            condition: "VERY_GOOD",
            images: [
                "https://picsum.photos/seed/hoodie1/800/1000"
            ]
        },
        {
            sellerId: seller.id,
            categoryId: categoryHerren.id,
            title: "Tommy Hilfiger Hemd - Navy",
            description: "Klassisches Button-Down-Hemd von Tommy Hilfiger. Slim Fit. Kaum getragen, top Zustand!",
            price: 42.00,
            brand: "Tommy Hilfiger",
            size: "M",
            color: "Dunkelblau",
            condition: "VERY_GOOD",
            images: [
                "https://picsum.photos/seed/hemd1/800/1000"
            ]
        },
        {
            sellerId: seller.id,
            categoryId: categoryHerren.id,
            title: "Adidas Originals Jogginghose",
            description: "Adidas Originals Jogginghose mit den klassischen 3 Streifen. Bequem und stylisch!",
            price: 35.00,
            brand: "Adidas",
            size: "M",
            color: "Schwarz",
            condition: "GOOD",
            images: [
                "https://picsum.photos/seed/jogger1/800/1000"
            ]
        },
        // SCHUHE (2 ürün)
        {
            sellerId: seller.id,
            categoryId: categorySchuhe.id,
            title: "Nike Air Force 1 Low - Triple White",
            description: "Original Nike Air Force 1 in Triple White. Nur 2x getragen, wie neu! Inkl. Originalkarton. Größe fällt normal aus.",
            price: 89.00,
            brand: "Nike",
            size: "42",
            color: "Weiß",
            condition: "VERY_GOOD",
            images: [
                "https://picsum.photos/seed/nike1/800/1000",
                "https://picsum.photos/seed/nike2/800/1000"
            ]
        },
        {
            sellerId: seller.id,
            categoryId: categorySchuhe.id,
            title: "Dr. Martens 1460 Boots - Cherry Red",
            description: "Ikonische Dr. Martens Boots in Cherry Red. Gut eingelaufen und super bequem. Robuste Qualität für Jahre!",
            price: 95.00,
            brand: "Dr. Martens",
            size: "39",
            color: "Rot",
            condition: "GOOD",
            images: [
                "https://picsum.photos/seed/docs1/800/1000"
            ]
        }
    ]

    for (const p of products) {
        await prisma.product.create({
            data: {
                sellerId: p.sellerId,
                categoryId: p.categoryId,
                title: p.title,
                description: p.description,
                price: p.price,
                currency: 'EUR',
                brand: p.brand,
                size: p.size,
                color: p.color,
                condition: p.condition as any, // Enum type fix
                status: 'AVAILABLE',
                viewCount: Math.floor(Math.random() * 100),
                likeCount: Math.floor(Math.random() * 20),
                images: {
                    create: p.images.map((url, idx) => ({ url, order: idx + 1 })),
                },
            },
        })
    }

    console.log('✅ Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
