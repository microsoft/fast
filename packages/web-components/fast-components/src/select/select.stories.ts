import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";
import { FASTSelect, FASTListbox, FASTOption } from ".";

// Prevent tree-shaking
FASTSelect;
FASTOption;
FASTListbox;
FASTDesignSystemProvider;

export default {
    title: "Select",
};

export const Base = () => Examples;
