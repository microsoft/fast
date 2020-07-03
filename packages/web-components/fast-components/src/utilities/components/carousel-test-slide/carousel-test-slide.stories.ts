import { FASTDesignSystemProvider } from "../../../design-system-provider";
import Examples from "./fixtures/base.html";
import { FASTCarouselTestSlide } from ".";

//Prevent tree-shaking
FASTCarouselTestSlide;
FASTDesignSystemProvider;

export const Base = () => Examples;
