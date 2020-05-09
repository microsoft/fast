import { MSFTDesignSystemProvider } from "../design-system-provider";
import FlipperTemplate from "./fixtures/flipper.html";
import { MSFTFlipper } from "./";

// Prevent tree-shaking
MSFTFlipper;
MSFTDesignSystemProvider;

export default {
    title: "Flipper",
};

export const Flipper = () => FlipperTemplate;
