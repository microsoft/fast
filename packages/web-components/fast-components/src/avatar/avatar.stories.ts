import { FASTDesignSystemProvider } from "../design-system-provider";
import { FASTBadge } from "../badge";
import AvatarTemplate from "./fixtures/base.html";
import { FASTAvatar } from ".";

// Prevent tree-shaking
FASTAvatar;
FASTDesignSystemProvider;
FASTBadge;

export default {
    title: "Avatar",
};

export const Avatar = () => AvatarTemplate;
