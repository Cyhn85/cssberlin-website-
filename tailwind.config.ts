import type { Config } from "tailwindcss";

const config: Config = {
    // ÖNEMLİ: Projeniz 'src' klasörü kullandığı için yolların doğruluğu kritiktir.
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/actions/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Berlin Vintage kurumsal renk paleti
                brand: {
                    green: "#1a3b28", // Berlin Green
                    orange: "#e05e00", // CSS Orange
                    cream: "#fdfbf7",
                },
                // globals.css içindeki değişkenlerle tam uyum
                border: "hsl(var(--border))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#1a3b28",
                    foreground: "#fdfbf7",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            animation: {
                marquee: 'marquee 25s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        },
    },
    // Not: Build sırasında hata alırsanız 'npm install tailwindcss-animate' komutunu çalıştırın.
    plugins: [require("tailwindcss-animate")],
};
export default config;