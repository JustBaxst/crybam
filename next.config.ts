import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        qualities: [75, 100],
        remotePatterns: [
            // ─── MyDramaList ───
            { protocol: "https", hostname: "i.mydramalist.com" },
            { protocol: "https", hostname: "s.mydramalist.com" },
            // ─── Кинопоиск (неофициальный API + редиректы) ───
            { protocol: "https", hostname: "kinopoiskapiunofficial.tech" },
            { protocol: "https", hostname: "st.kp.yandex.net" },
            { protocol: "https", hostname: "avatars.mds.yandex.net" },
            // ─── GitHub (маскот, статика из репозитория) ───
            { protocol: "https", hostname: "raw.githubusercontent.com" },
            // ─── YouTube / Spotify и т.д. (обложки для саундтреков) ───
            { protocol: "https", hostname: "i.ytimg.com" },
            { protocol: "https", hostname: "i.scdn.co" },
            { protocol: "https", hostname: "i1.sndcdn.com" },
            { protocol: "https", hostname: "**.sndcdn.com" }, // на случай других поддоменов
            { protocol: "https", hostname: "vk-cdn.net" },
            { protocol: "https", hostname: "**.vk-cdn.net" },
            { protocol: "https", hostname: "mycdn.me" },
            { protocol: "https", hostname: "avatars.yandex.net" },
            // ─── TVmaze (импорт) ───
            { protocol: "https", hostname: "static.tvmaze.com" },
        ],
    },
};

export default nextConfig;