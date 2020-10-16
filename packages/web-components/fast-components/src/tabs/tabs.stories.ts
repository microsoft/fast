import { FASTDesignSystemProvider } from "../design-system-provider";
import { FASTTab } from "../tab";
import { FASTTabPanel } from "../tab-panel";
import Examples from "./fixtures/base.html";
import { FASTTabs } from ".";

// Prevent tree-shaking
FASTTab;
FASTTabPanel;
FASTTabs;
FASTDesignSystemProvider;

export default {
    title: "Tabs",
};

export const Base = () => Examples;
