import { FASTDivider } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import DividerTemplate from "./fixtures/divider.html";

// Prevent tree-shaking
FASTDivider;
FASTDesignSystemProvider;

export default {
    title: "Divider",
};

export const Divider = () => DividerTemplate;
