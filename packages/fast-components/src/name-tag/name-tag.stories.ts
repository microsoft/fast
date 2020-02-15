import { FASTNameTag } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import MarkTemplate from "./fixtures/mark.html";

// Prevent tree-shaking
FASTNameTag;
FASTDesignSystemProvider;

export default {
    title: "Name tag",
};

export const Mark = () => MarkTemplate;
