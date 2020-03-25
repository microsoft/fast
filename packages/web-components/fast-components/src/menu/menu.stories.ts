import { FASTMenu } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import MenuTemplate from "./fixtures/menu.html";

// Prevent tree-shaking
FASTMenu;
FASTDesignSystemProvider;

export default {
    title: "Menu",
};

export const Menu = () => MenuTemplate;
