import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";
import { FASTSliderLabel } from ".";

// Prevent tree-shaking
FASTSliderLabel;
FASTDesignSystemProvider;

export default {
    title: "SliderLabel",
};

export const SliderLabel = () => Examples;
