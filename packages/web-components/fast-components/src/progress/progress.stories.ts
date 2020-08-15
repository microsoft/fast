import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/linear.html";
import { FASTProgress } from "./index";

// Prevent tree-shaking
FASTProgress;
FASTDesignSystemProvider;

export default {
    title: "Progress",
};

export const Base = () => Examples;
