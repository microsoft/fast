import { FASTMenuItem } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import MenuItemTemplate from "./fixtures/menu-item.html";

// Prevent tree-shaking
FASTMenuItem;
FASTDesignSystemProvider;

export default {
    title: "Menu item",
};

export const MenuItem = () => MenuItemTemplate;
