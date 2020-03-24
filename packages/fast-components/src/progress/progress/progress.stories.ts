import { FASTProgress } from ".";
import { FASTDesignSystemProvider } from "../../design-system-provider";
import Examples from "./fixtures/linear.html";

// Prevent tree-shaking
FASTProgress;
FASTDesignSystemProvider;

export default {
    title: "Progress",
};

export const Base = () => Examples;
