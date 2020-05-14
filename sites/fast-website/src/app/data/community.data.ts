export interface CommunityContentPlacementData {
    iconSrc: string;
    iconAlt: string;
    header: string;
    body: string;
    actionText: string;
    actionLink: string;
}

export const communityContentPlacementData: CommunityContentPlacementData[] = [
    {
        iconSrc: "https://via.placeholder.com/16",
        iconAlt: "Discord",
        header: "Discord",
        body:
            "Join our active community on Discord. Follow the latest updates and contributions, ask questions, give feedback, or keep up on our reading list.",
        actionText: "Join the Discord Chat",
        actionLink: "#",
    },
    {
        iconSrc: "https://via.placeholder.com/16",
        iconAlt: "Twitter",
        header: "Twitter",
        body:
            "Follow along as we share out the latest happenings on Twitter. You will find important updates, announcements, and sneak peeks.",
        actionText: "Follow us on Twitter",
        actionLink: "#",
    },
    {
        iconSrc: "https://via.placeholder.com/16",
        iconAlt: "Github",
        header: "Github",
        body:
            "Explore the FAST repository on Github and try out our components, utilities, and tools. Or, mix-and-match with your own solutions.",
        actionText: "Get Started on Github",
        actionLink: "https://github.com/microsoft/fast-dna",
    },
];