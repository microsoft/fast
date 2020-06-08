import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";
import { FASTCarousel } from ".";

//Prevent tree-shaking
FASTCarousel;
FASTDesignSystemProvider;

export default {
    title: "Carousel",
};

export const Base = () => Examples;
