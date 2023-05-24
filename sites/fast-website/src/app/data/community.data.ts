import DiscordIcon from "svg/icon-discord.svg";
import GithubIcon from "svg/icon-github.svg";
import TwitterIcon from "svg/icon-twitter.svg";
import MediumIcon from "svg/icon-medium.svg";
import { FeatureLink } from "./feature.data";

export interface CommunityContentPlacementData extends FeatureLink {
    body?: string;
    header?: string;
    icon: string;
}

export const communityContentPlacementData: CommunityContentPlacementData[] = [
    {
        url: "https://discord.gg/FcSNfg4",
        anchorText: "Join the Discord Chat",
        body: "Join our active community on Discord. Follow the latest updates and contributions, ask questions, give feedback, or keep up on our reading list.",
        header: "Discord",
        icon: DiscordIcon,
    },
    {
        url: "https://twitter.com/FAST_UI",
        anchorText: "Follow us on Twitter",
        body: "Follow along as we share out the latest happenings on Twitter. You will find important updates, announcements, and sneak peeks.",
        header: "Twitter",
        icon: TwitterIcon,
    },
    {
        url: "https://github.com/microsoft/fast",
        anchorText: "Get Started on GitHub",
        body: "Explore the FAST repository on GitHub and try out our components, utilities, and tools. Or, mix-and-match with your own solutions.",
        header: "GitHub",
        icon: GithubIcon,
    },
    {
        url: "https://medium.com/fast-design",
        anchorText: "Read more on Medium",
        header: "Medium",
        icon: MediumIcon,
    },
];
