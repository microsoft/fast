import { MSFTDesignSystemProvider } from "../design-system-provider";
import AnchorTemplate from "./fixtures/anchor.html";
import { MSFTAnchor } from "./";

// Prevent tree-shaking
MSFTAnchor;
MSFTDesignSystemProvider;

export default {
    title: "Anchor",
};

export const Anchor = () => AnchorTemplate;
