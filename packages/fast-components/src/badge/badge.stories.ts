import { FASTBadge } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import BadgeTemplate from "./fixtures/base.html";

// Prevent tree-shaking
FASTBadge;
FASTDesignSystemProvider;

export default {
    title: "Badge",
};

export const Badge = () => BadgeTemplate;
