import { MSFTDesignSystemProvider } from "../../design-system-provider";
import Examples from "./fixtures/circular.html";
import { MSFTProgressRing } from ".";

// Prevent tree-shaking
MSFTProgressRing;
MSFTDesignSystemProvider;

export default {
    title: "Progress Ring",
};

export const ProgressRing = () => Examples;
