import { FASTFlipper } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import FlipperTemplate from "./fixtures/flipper.html";

// Prevent tree-shaking
FASTFlipper;
FASTDesignSystemProvider;

export default {
    title: "Flipper",
};

export const Flipper = () => FlipperTemplate;
