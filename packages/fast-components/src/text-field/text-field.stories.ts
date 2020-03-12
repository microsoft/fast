import { FASTTextField } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import TextFieldTemplate from "./fixtures/text-field.html";

// Prevent tree-shaking
FASTTextField;
FASTDesignSystemProvider;

export default {
    title: "Text Field",
};

export const TextField = () => TextFieldTemplate;
