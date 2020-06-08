import { FASTDesignSystemProvider } from "../../../design-system-provider";
import { FASTCarouselTestSlide } from "..";
import Examples from "./fixtures/base.html";

//Prevent tree-shaking
FASTCarouselTestSlide;
FASTDesignSystemProvider;

export const Base = () => Examples;
