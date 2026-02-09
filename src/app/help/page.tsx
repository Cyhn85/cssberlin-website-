import { Metadata } from "next";
import Link from "next/link";
import {
    HelpCircle,
    ShoppingBag,
    Truck,
    CreditCard,
    Shield,
    MessageCircle,
    Package,
    RotateCcw,
    User,
    ChevronRight,
    Search,
    Mail,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Yardım Merkezi",
    description: "CSS Berlin Yardım Merkezi - Sıkça Sorulan Sorular ve Destek",
};

const helpCategories = [
    {
        icon: ShoppingBag,
        title: "Satın Alma",
        description: "Satın alma süreci, ödeme ve sepet işlemleri",
        topics: [
            "Ürün nasıl satın alırım?",
            "Ödeme yöntemleri nelerdir?",
            "Siparişimi nasıl takip ederim?",
            "Teklif nasıl yaparım?",
        ],
    },
    {
        icon: Package,
        title: "Satış",
        description: "Ürün ekleme, fiyatlandırma ve satış ipuçları",
        topics: [
            "Ürün nasıl eklerim?",
            "Fiyat nasıl belirlemeliyim?",
            "Ürün fotoğrafı nasıl çekmeliyim?",
            "Satış komisyonu nedir?",
        ],
    },
    {
        icon: Truck,
        title: "Kargo",
        description: "Kargo seçenekleri, takip ve teslimat",
        topics: [
            "Kargo nasıl gönderilir?",
            "Kargo ücreti ne kadar?",
            "Teslimat süresi ne kadar?",
            "Kargo takibi nasıl yapılır?",
        ],
    },
    {
        icon: CreditCard,
        title: "Ödemeler",
        description: "Ödeme güvenliği ve cüzdan işlemleri",
        topics: [
            "Ödemeler güvenli mi?",
            "Cüzdan bakiyemi nasıl çekerim?",
            "Ödeme neden beklemede?",
            "Para ne zaman gelir?",
        ],
    },
    {
        icon: Shield,
        title: "Güvenlik",
        description: "Alıcı koruması ve güvenli alışveriş",
        topics: [
            "Alıcı koruması nedir?",
            "Sahte ürün geldiyse ne yapmalıyım?",
            "Ürün gelmezse ne olur?",
            "Hesabımı nasıl korurum?",
        ],
    },
    {
        icon: RotateCcw,
        title: "İade & İptal",
        description: "İade süreci ve iptal işlemleri",
        topics: [
            "Ürün nasıl iade edilir?",
            "İade süresi ne kadar?",
            "Siparişi iptal edebilir miyim?",
            "Para iadesi ne kadar sürer?",
        ],
    },
    {
        icon: User,
        title: "Hesap",
        description: "Profil, ayarlar ve hesap yönetimi",
        topics: [
            "Şifremi nasıl değiştiririm?",
            "Hesabımı nasıl silerim?",
            "Profil fotoğrafı nasıl değiştirilir?",
            "Bildirim ayarları",
        ],
    },
    {
        icon: MessageCircle,
        title: "Mesajlaşma",
        description: "İletişim ve mesaj sistemi",
        topics: [
            "Satıcıyla nasıl iletişime geçerim?",
            "Mesaj bildirimleri",
            "Spam mesaj bildirme",
            "Engelleme nasıl yapılır?",
        ],
    },
];

const popularQuestions = [
    {
        question: "Ürün satın aldım ama gelmedi, ne yapmalıyım?",
        answer: "Öncelikle kargo takip numarasını kontrol edin. Eğer 10 iş günü içinde ürün ulaşmazsa, sipariş detay sayfasından 'Problem Bildir' butonuna tıklayarak talebinizi açın. Alıcı koruması kapsamında paranız güvende.",
    },
    {
        question: "Satışımdan ne kadar komisyon kesiliyor?",
        answer: "CSS Berlin, başarılı her satıştan %5 komisyon almaktadır. Örneğin 100€ satış yaparsanız, 95€ cüzdanınıza aktarılır.",
    },
    {
        question: "Cüzdan bakiyemi nasıl çekerim?",
        answer: "Profil > Cüzdan sayfasından 'Para Çek' butonuna tıklayın. IBAN bilgilerinizi girin ve minimum 10€ tutarında çekim yapabilirsiniz. Transfer 2-3 iş günü içinde hesabınıza ulaşır.",
    },
    {
        question: "Ürün açıklamadan farklı geldi, ne yapmalıyım?",
        answer: "Ürünü teslim aldıktan sonra 48 saat içinde fotoğraflı olarak problem bildirmeniz gerekiyor. Sipariş detayından 'Problem Bildir' seçeneğini kullanın. Ekibimiz inceleyecek ve uygunsa tam iade yapılacaktır.",
    },
];

export default function HelpPage() {
    return (
        <div className="page-container bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#2E9E5C] to-[#258A4F] text-white py-16">
                <div className="container px-4 md:px-6 text-center">
                    <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Nasıl yardımcı olabiliriz?
                    </h1>
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Bir sorun veya soru arayın..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30"
                        />
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 py-12">
                {/* Categories */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Yardım Kategorileri
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {helpCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={category.title}
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                >
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2E9E5C] transition-colors">
                                        <Icon className="w-6 h-6 text-[#2E9E5C] group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {category.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {category.topics.slice(0, 3).map((topic) => (
                                            <li key={topic}>
                                                <Link
                                                    href="#"
                                                    className="text-sm text-gray-600 hover:text-[#2E9E5C] flex items-center gap-1"
                                                >
                                                    <ChevronRight className="w-3 h-3" />
                                                    {topic}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Popular Questions */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Sıkça Sorulan Sorular
                    </h2>
                    <div className="space-y-4">
                        {popularQuestions.map((faq, index) => (
                            <details
                                key={index}
                                className="bg-white rounded-xl shadow-sm group"
                            >
                                <summary className="p-4 flex items-center justify-between cursor-pointer list-none">
                                    <span className="font-medium text-gray-900">
                                        {faq.question}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-gray-400 transform transition-transform group-open:rotate-90" />
                                </summary>
                                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section>
                    <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                        <MessageCircle className="w-12 h-12 text-[#2E9E5C] mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Hala yardıma mı ihtiyacınız var?
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Ekibimiz size yardımcı olmak için burada. Sorularınızı bize
                            iletin.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="mailto:support@cssberlin.de"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <Mail className="w-5 h-5" />
                                E-posta Gönder
                            </a>
                            <Link
                                href="/inbox"
                                className="btn-secondary inline-flex items-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Destek Sohbeti
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
