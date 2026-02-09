"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Condition } from "@prisma/client";

// Formdan gelen verileri tanımla
interface CreateProductData {
    title: string;
    description: string;
    price: number;
    categoryId: string;
    brand?: string;
    size?: string;
    condition: string;
    images: string[];
}

export async function createProduct(data: CreateProductData) {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        throw new Error("Unauthorized");
    }

    // Kullanıcıyı veritabanında bul (clerkId -> dbId)
    const user = await db.user.findUnique({
        where: { clerkId },
    });

    if (!user) {
        throw new Error("User not found in database. Please complete your profile.");
    }

    // Condition mapping (Frontend string -> Prisma Enum)
    let conditionEnum: Condition = Condition.GOOD; // Default
    switch (data.condition) {
        case "new_with_tags": conditionEnum = Condition.NEW_WITH_TAGS; break;
        case "new_without_tags": conditionEnum = Condition.NEW_WITHOUT_TAGS; break;
        case "very_good": conditionEnum = Condition.VERY_GOOD; break;
        case "good": conditionEnum = Condition.GOOD; break;
        case "satisfactory": conditionEnum = Condition.SATISFACTORY; break;
    }

    // Kategori Mapping (Slug -> ID)
    // Frontend gönderdiği sluglar: damen, herren, schuhe
    let categoryId = data.categoryId;

    // Eğer slug geldiyse, DB'den ID'sini bul
    const category = await db.category.findUnique({
        where: { slug: data.categoryId }
    });

    if (category) {
        categoryId = category.id;
    } else {
        // Fallback: Eğer kategori bulunamazsa "Diğer" veya ilk kategoriyi kullan
        // Veya "damen" -> "Damen" mapping yap
        const firstCat = await db.category.findFirst();
        if (firstCat) categoryId = firstCat.id;
    }

    try {
        // Ürünü oluştur
        const product = await db.product.create({
            data: {
                sellerId: user.id,
                categoryId: categoryId,
                title: data.title,
                description: data.description,
                price: data.price,
                currency: "EUR",
                brand: data.brand || null,
                size: data.size || null,
                condition: conditionEnum,
                status: "AVAILABLE",
                images: {
                    create: data.images.map((url, index) => ({
                        url: url,
                        order: index + 1,
                    })),
                },
            },
        });

        console.log(`✅ Product created: ${product.id}`);

        // Cache temizle
        revalidatePath("/");
        revalidatePath("/catalog");
        revalidatePath("/profile");

        return { success: true, productId: product.id };
    } catch (error) {
        console.error("Failed to create product:", error);
        return { success: false, error: "Failed to create product" };
    }
}
