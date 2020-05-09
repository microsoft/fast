import { MSFTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/slider-label.html";
import { MSFTSliderLabel } from "./";

// Prevent tree-shaking
MSFTSliderLabel;
MSFTDesignSystemProvider;

export default {
    title: "Slider label",
};

export const SliderLabel = () => Examples;
