import { MSFTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/radio-group.html";
import { MSFTRadioGroup } from "./";

// Prevent tree-shaking
MSFTRadioGroup;
MSFTDesignSystemProvider;

export default {
    title: "RadioGroup",
};

export const RadioGroup = () => Examples;
