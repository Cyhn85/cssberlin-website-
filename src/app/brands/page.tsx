import Link from "next/link";

const brands = [
    "Nike", "Adidas", "Zara", "H&M", "Levi's", "Mango",
    "The North Face", "Dr. Martens", "Tommy Hilfiger", "Calvin Klein",
    "Ralph Lauren", "Puma", "New Balance", "Converse", "Vans",
    "Gucci", "Lacoste", "Hugo Boss", "Diesel", "Vintage",
];

export default function BrandsPage() {
    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-black text-berlin-green mb-2">Marken</h1>
            <div className="w-16 h-1 bg-css-orange rounded-full mb-8" />

            <p className="text-gray-600 mb-8 max-w-2xl">
                Entdecke Second-Hand Artikel von deinen Lieblingsmarken. Nachhaltig shoppen war noch nie so einfach.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {brands.map((brand) => (
                    <Link
                        key={brand}
                        href={`/catalog?brand=${encodeURIComponent(brand)}`}
                        className="bg-white border border-gray-200 hover:border-css-orange rounded-xl p-4 text-center font-semibold text-gray-800 hover:text-css-orange transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                        {brand}
                    </Link>
                ))}
            </div>
        </div>
    );
}
