import { FASTCheckbox } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";

// Prevent tree-shaking
FASTCheckbox;
FASTDesignSystemProvider;

export default {
    title: "Checkbox",
};

export const Base = () => Examples;
