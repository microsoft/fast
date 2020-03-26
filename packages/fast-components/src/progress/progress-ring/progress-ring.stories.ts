import { FASTProgressRing } from ".";
import { FASTDesignSystemProvider } from "../../design-system-provider";
import Examples from "./fixtures/circular.html";

// Prevent tree-shaking
FASTProgressRing;
FASTDesignSystemProvider;

export default {
    title: "Progress Ring",
};

export const Base = () => Examples;
