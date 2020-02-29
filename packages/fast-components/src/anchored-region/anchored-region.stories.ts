import { FASTAnchoredRegion } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import BaseTemplate from "./fixtures/base.html";

// Prevent tree-shaking
FASTAnchoredRegion;
FASTDesignSystemProvider;

export default {
    title: "Anchored region",
};

export const base = () => BaseTemplate;
