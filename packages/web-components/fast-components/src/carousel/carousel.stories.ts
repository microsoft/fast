import { FASTDesignSystemProvider } from "../design-system-provider";
import BasicExamples from "./fixtures/basic.html";
import TabbedExamples from "./fixtures/tabbed.html";
import { FASTCarousel } from ".";

//Prevent tree-shaking
FASTCarousel;
FASTDesignSystemProvider;

export default {
    title: "Carousel",
};

export const Basic = () => BasicExamples;
export const Tabbed = () => TabbedExamples;
