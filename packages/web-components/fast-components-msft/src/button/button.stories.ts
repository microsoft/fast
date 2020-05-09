import { MSFTDesignSystemProvider } from "../design-system-provider";
import ButtonTemplate from "./fixtures/button.html";
import { MSFTButton } from "./";

// Prevent tree-shaking
MSFTButton;
MSFTDesignSystemProvider;

export default {
    title: "Button",
};

export const Button = () => ButtonTemplate;
