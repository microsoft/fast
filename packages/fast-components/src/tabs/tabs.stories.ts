import { FASTTabs } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";

// Prevent tree-shaking
FASTTabs;
FASTDesignSystemProvider;

export default {
    title: "Tabs",
};

export const Base = () => Examples;
