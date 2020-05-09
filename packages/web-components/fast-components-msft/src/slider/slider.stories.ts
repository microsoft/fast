import { MSFTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/slider.html";
import { MSFTSlider } from "./";

// Prevent tree-shaking
MSFTSlider;
MSFTDesignSystemProvider;

export default {
    title: "Slider",
};

export const Slider = () => Examples;
