import { MSFTDesignSystemProvider } from "../../design-system-provider";
import Examples from "./fixtures/linear.html";
import { MSFTProgress } from "./";

// Prevent tree-shaking
MSFTProgress;
MSFTDesignSystemProvider;

export default {
    title: "Progress",
};

export const Progress = () => Examples;
