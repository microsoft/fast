import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";
import { FASTShareGroup } from "./share-group";
import { FASTShareLink } from "./share-link";
import { FASTShare } from ".";

// Prevent tree-shaking
FASTShare;
FASTShareGroup;
FASTShareLink;
FASTDesignSystemProvider;

export default {
    title: "Share",
};

export const Base = () => Examples;
