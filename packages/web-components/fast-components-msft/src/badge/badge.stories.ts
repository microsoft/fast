import { MSFTDesignSystemProvider } from "../design-system-provider";
import BadgeTemplate from "./fixtures/badge.html";
import { MSFTBadge } from "./";

// Prevent tree-shaking
MSFTBadge;
MSFTDesignSystemProvider;

export default {
    title: "Badge",
};

export const Badge = () => BadgeTemplate;
