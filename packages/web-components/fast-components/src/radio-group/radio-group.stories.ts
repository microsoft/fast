import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";
import { FASTRadioGroup } from "./";

// Prevent tree-shaking
FASTRadioGroup;
FASTDesignSystemProvider;

export default {
    title: "RadioGroup",
};

export const RadioGroup = () => Examples;
