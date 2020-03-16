import { FASTTreeView } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import TreeViewTemplate from "./fixtures/tree-view.html";

// Prevent tree-shaking
FASTTreeView;
FASTDesignSystemProvider;

export default {
    title: "Tree View",
};

export const TreeView = () => TreeViewTemplate;
