import { FASTSliderLabel } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";

// Prevent tree-shaking
FASTSliderLabel;
FASTDesignSystemProvider;

export default {
    title: "SliderLabel",
};

export const Base = () => Examples;
