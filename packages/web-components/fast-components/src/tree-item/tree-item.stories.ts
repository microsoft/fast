import { FASTTreeItem } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import TreeItemTemplate from "./fixtures/tree-item.html";

// Prevent tree-shaking
FASTTreeItem;
FASTDesignSystemProvider;

export default {
    title: "Tree item",
};

export const TreeItem = () => TreeItemTemplate;
