import { FASTSlider } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";

// Prevent tree-shaking
FASTSlider;
FASTDesignSystemProvider;

export default {
    title: "Slider",
};

export const Base = () => Examples;
