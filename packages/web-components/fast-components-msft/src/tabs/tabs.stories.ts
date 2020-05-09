import { MSFTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/tabs.html";
import { MSFTTab } from "./tab";
import { MSFTTabPanel } from "./tab-panel";
import { MSFTTabs } from "./";

// Prevent tree-shaking
MSFTTab;
MSFTTabPanel;
MSFTTabs;
MSFTDesignSystemProvider;

export default {
    title: "Tabs",
};

export const Base = () => Examples;
