import {
    FaInstagram, FaYoutube, FaTwitter, FaTiktok, FaWikipediaW,
    FaGlobe, FaFacebook, FaLinkedin, FaTelegram, FaDiscord,
    FaRedditAlien, FaPinterest, FaSnapchat, FaTwitch, FaVk,
    FaSpotify, FaSoundcloud, FaImdb, FaGithub, FaMedium, FaWeibo, FaYandex
} from "react-icons/fa6";
import {
    SiThreads, SiBluesky, SiLine, SiWechat,
    SiBilibili, SiNaver, SiKakaotalk, SiApplemusic,
    SiTumblr, SiVimeo, SiDailymotion, SiPatreon,
    SiMastodon, SiSubstack, SiFlickr
} from "react-icons/si";
import { Link as LinkIcon } from "lucide-react";

export const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    instagram: FaInstagram, youtube: FaYoutube, twitter: FaTwitter, x: FaTwitter,
    tiktok: FaTiktok, weibo: FaWeibo, wikipedia: FaWikipediaW, website: FaGlobe,
    facebook: FaFacebook, linkedin: FaLinkedin, telegram: FaTelegram, discord: FaDiscord,
    reddit: FaRedditAlien, pinterest: FaPinterest, snapchat: FaSnapchat, twitch: FaTwitch,
    vk: FaVk, spotify: FaSpotify, soundcloud: FaSoundcloud, imdb: FaImdb,
    github: FaGithub, medium: FaMedium, threads: SiThreads, bluesky: SiBluesky,
    line: SiLine, wechat: SiWechat, bilibili: SiBilibili, naver: SiNaver,
    kakao: SiKakaotalk, applemusic: SiApplemusic, yandexmusic: FaYandex, douyin: FaTiktok,
    tumblr: SiTumblr, vimeo: SiVimeo, dailymotion: SiDailymotion, patreon: SiPatreon,
    mastodon: SiMastodon, substack: SiSubstack, flickr: SiFlickr,
};

export function getSocialIcon(platform: string) {
    return SOCIAL_ICONS[platform.toLowerCase()] || LinkIcon;
}