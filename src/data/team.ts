import klImg from "@/assets/kl.png";
import partyImg from "@/assets/party.jpg";

export type Member = {
  slug: string;
  name: string;
  tagline: string;
  telegram: string;
  image: string;
  interests: string[];
  achievements: string[];
};

export const team: Member[] = [
  {
    slug: "kl",
    name: "kl",
    tagline: "xss warrior",
    telegram: "https://t.me/SadistFucker/",
    image: klImg,
    interests: [
      "osint",
      "investigation",
      "cybersecurity",
      "infosec",
      "malware development",
      "malware analysis",
      "coding",
      "web exploitation",
      "xss",
    ],
    achievements: [
      "discovered multiple stored and reflected xss vectors across production targets",
      "developed custom payload chains for filter bypass",
      "contributed to private vulnerability research reports",
      "automated reconnaissance pipelines for web targets",
      "handled real world exploit scenarios (web layer)",
    ],
  },
  {
    slug: "party",
    name: "party",
    tagline: "exploitation focused",
    telegram: "https://t.me/netIeak/",
    image: partyImg,
    interests: [
      "osint investigation",
      "cyber security",
      "scripting",
      "coding",
      "infosec",
      "exploit development",
      "network exploitation",
      "website tampering",
    ],
    achievements: [
      "developed exploit chains across web and network surfaces",
      "performed large scale reconnaissance operations",
      "identified misconfigurations in production infrastructure",
      "built custom scripts for automation and exploitation",
      "active in offensive security workflows",
    ],
  },
];
