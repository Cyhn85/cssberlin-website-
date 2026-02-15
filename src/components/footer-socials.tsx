"use client";

import AnimatedSocialLinks, { type Social } from "@/components/ui/social-links";

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

export function FooterSocials() {
    return (
        <div className="flex items-center justify-center py-4">
            <AnimatedSocialLinks socials={socials} />
        </div>
    );
}
