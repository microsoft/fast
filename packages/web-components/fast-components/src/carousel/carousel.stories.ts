import { FASTCarousel } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import CarouselTemplate from "./fixtures/carousel.html";

// Prevent tree-shaking
FASTCarousel;
FASTDesignSystemProvider;

export default {
    title: "Carousel",
};

export const Carousel = () => CarouselTemplate;
