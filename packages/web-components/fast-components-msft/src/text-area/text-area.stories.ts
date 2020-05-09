import { MSFTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/text-area.html";
import { MSFTTextArea } from "./";

// Prevent tree-shaking
MSFTTextArea;
MSFTDesignSystemProvider;

export default {
    title: "Text area",
};

export const TextArea = () => Examples;
