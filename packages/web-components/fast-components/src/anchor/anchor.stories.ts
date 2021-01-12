import { FASTDesignSystemProvider } from "../design-system-provider";
import AnchorTemplate from "./fixtures/anchor.html";
import { FASTAnchor, MyCounter } from "./";

// Prevent tree-shaking
FASTAnchor;
FASTDesignSystemProvider;
MyCounter;

export default {
    title: "Anchor",
};

export const Anchor = () => AnchorTemplate;
