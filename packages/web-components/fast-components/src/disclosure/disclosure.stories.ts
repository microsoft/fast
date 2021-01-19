import { FASTDesignSystemProvider } from "../design-system-provider";
import DisclosureTemplate from "./fixtures/disclosure.html";
import { FASTDisclosure } from ".";

// Prevent tree-shaking
FASTDisclosure;
FASTDesignSystemProvider;

export default {
    title: "Disclosure",
};

export const disclosure = () => DisclosureTemplate;
