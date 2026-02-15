"use client";

import AnimatedSocialLinks, { type Social } from "@/components/ui/social-links";
import { Mail } from "lucide-react";

const socials: Social[] = [
    {
        name: "TikTok",
        image: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
        href: "https://tiktok.com/@cssberlin",
    },
    {
        name: "Instagram",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
        href: "https://instagram.com/cssberlin",
    },
    {
        name: "Facebook",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg",
        href: "https://facebook.com/cssberlin",
    },
    {
        name: "YouTube",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
        href: "https://youtube.com/@cssberlin",
    },
];

export function SocialBanner() {
    return (
        <div className="bg-gradient-to-br from-css-orange via-css-orange/80 to-berlin-green rounded-xl p-5 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">
                    Folge uns
                </p>
                <p className="text-white/50 text-[9px] font-bold">
                    Hover & entdecke unsere Community
                </p>
            </div>

            <div className="relative z-10 flex items-center justify-center pt-2">
                <AnimatedSocialLinks socials={socials} />
                <a
                    href="mailto:hallo@cssberlin.de"
                    className="relative cursor-pointer px-4 md:px-5 py-2 transition-opacity duration-200 hover:opacity-100 group"
                    title="Schreib uns"
                >
                    <span className="block text-sm md:text-base font-black text-white tracking-wide">
                        Kontakt
                    </span>
                </a>
            </div>
        </div>
    );
}
