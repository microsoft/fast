import { FASTAnchor, FASTButton } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import ButtonTemplate from "./fixtures/button.html";

// Prevent tree-shaking
FASTAnchor;
FASTButton;
FASTDesignSystemProvider;

export default {
    title: "Button",
};

export const Button = () => ButtonTemplate;
