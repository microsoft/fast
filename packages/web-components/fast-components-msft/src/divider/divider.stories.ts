import { MSFTDesignSystemProvider } from "../design-system-provider";
import DividerTemplate from "./fixtures/divider.html";
import { MSFTDivider } from "./";

// Prevent tree-shaking
MSFTDivider;
MSFTDesignSystemProvider;

export default {
    title: "Divider",
};

export const Divider = () => DividerTemplate;
