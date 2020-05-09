import { MSFTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/text-field.html";
import { MSFTTextField } from "./";

// Prevent tree-shaking
MSFTTextField;
MSFTDesignSystemProvider;

export default {
    title: "Text field",
};

export const TextField = () => Examples;
