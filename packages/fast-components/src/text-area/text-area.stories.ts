import { FASTTextArea } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import TextAreaTemplate from "./fixtures/text-area.html";

// Prevent tree-shaking
FASTTextArea;
FASTDesignSystemProvider;

export default {
    title: "Text area",
};

export const TextField = () => TextAreaTemplate;
