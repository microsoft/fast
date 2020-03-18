import { FASTSwitch } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";

// Prevent tree-shaking
FASTSwitch;
FASTDesignSystemProvider;

export default {
    title: "Switch",
};

export const Base = () => Examples;
