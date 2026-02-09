const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Veritabanı temizleniyor...");

    // Sırayla sil (Foreign Key Constraints yüzünden)
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    console.log("Kullanıcılar oluşturuluyor...");

    // 1. Kullanıcılar
    // createManyAndReturn yerine createMany kullanalım garanti olsun (eski Prisma versiyonu ihtimaline karşı)
    // ama createMany return etmez. Ayrı create yapalım.

    const user1 = await prisma.user.create({
        data: {
            clerkId: "user_2sQeH3x6YvWz5JqR1kL9mN8bVc4",
            email: "alex@cssberlin.de",
            username: "alex_style",
            firstName: "Alex",
            lastName: "Müller",
            avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
            location: "Berlin, Mitte",
            isVerified: true,
        }
    });

    const user2 = await prisma.user.create({
        data: {
            clerkId: "user_2sQeH3x6YvWz5JqR1kL9mN8bVc5",
            email: "sarah@cssberlin.de",
            username: "sarah_vintage",
            firstName: "Sarah",
            lastName: "Weber",
            avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
            location: "Berlin, Kreuzberg",
            isVerified: true,
        }
    });

    const user3 = await prisma.user.create({
        data: {
            clerkId: "user_2sQeH3x6YvWz5JqR1kL9mN8bVc6",
            email: "max@cssberlin.de",
            username: "max_berlin",
            firstName: "Max",
            lastName: "Schmidt",
            avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
            location: "München",
            isVerified: false,
        }
    });

    console.log("Ürünler oluşturuluyor...");

    // 2. Ürünler
    // Alex'in Ürünleri
    await prisma.product.create({
        data: {
            sellerId: user1.id,
            title: "Nike Air Force 1 Low - Weiß",
            description: "Original Nike Air Force 1. Nur zweimal getragen. Sehr guter Zustand. Größe 42.",
            price: 85.00,
            currency: "EUR",
            brand: "Nike",
            size: "42",
            color: "Weiß",
            condition: "VERY_GOOD",
            status: "AVAILABLE",
            categoryId: null, // Şimdilik null
            images: {
                create: [
                    { url: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=800&fit=crop", order: 1 },
                    { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop", order: 2 }
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            sellerId: user1.id,
            title: "Vintage Lederjacke - Schwarz",
            description: "Echte Lederjacke aus den 90ern. Leichte Gebrauchsspuren, die den Charakter unterstreichen.",
            price: 120.00,
            currency: "EUR",
            brand: "Vintage",
            size: "L",
            color: "Schwarz",
            condition: "GOOD",
            status: "AVAILABLE",
            images: {
                create: [
                    { url: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&h=800&fit=crop", order: 1 }
                ]
            }
        }
    });

    // Sarah'nın Ürünleri
    await prisma.product.create({
        data: {
            sellerId: user2.id,
            title: "Zara Blazer - Beige",
            description: "Ungetragener Blazer von Zara. Etikett noch dran. Perfekt fürs Büro.",
            price: 45.00,
            currency: "EUR",
            brand: "Zara",
            size: "38",
            color: "Beige",
            condition: "NEW_WITH_TAGS",
            status: "AVAILABLE",
            images: {
                create: [
                    { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop", order: 1 }
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            sellerId: user2.id,
            title: "Adidas Stan Smith",
            description: "Klassiker. Stan Smith Sneaker in Weiß/Grün. Guter Zustand.",
            price: 55.00,
            currency: "EUR",
            brand: "Adidas",
            size: "39",
            color: "Weiß",
            condition: "GOOD",
            status: "AVAILABLE",
            images: {
                create: [
                    { url: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=800&h=800&fit=crop", order: 1 }
                ]
            }
        }
    });

    // Max'ın Ürünleri
    await prisma.product.create({
        data: {
            sellerId: user3.id,
            title: "Sony Kopfhörer WH-1000XM4",
            description: "Noise Cancelling Kopfhörer. Voll funktionsfähig. Kabel und Case dabei.",
            price: 180.00,
            currency: "EUR",
            brand: "Sony",
            size: null,
            color: "Schwarz",
            condition: "VERY_GOOD",
            status: "AVAILABLE",
            images: {
                create: [
                    { url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop", order: 1 }
                ]
            }
        }
    });

    console.log("Seeding tamamlandı! 🌱");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
