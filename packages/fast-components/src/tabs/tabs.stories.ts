import { FASTTabs } from ".";
import { FASTTab } from "./tab";
import { FASTTabPanel } from "./tab-panel";
import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";

// Prevent tree-shaking
FASTTabs;
FASTTab;
FASTTabPanel;
FASTDesignSystemProvider;

export default {
    title: "Tabs",
};

export const Base = () => Examples;
