import { FASTAccordionItem } from "../accordion-item";
import { FASTDesignSystemProvider } from "../design-system-provider";
import { accentFillRestBehavior } from "../styles/recipes";
import Examples from "./fixtures/base.html";
import { FASTAccordion } from "./index";

// Prevent tree-shaking
FASTAccordion;
FASTAccordionItem;
FASTDesignSystemProvider;

export default {
    title: "Accordion",
};

export const Base = () => Examples;

document.addEventListener("readystatechange", e => {
    if (document.readyState === "complete") {
        const provider = document.querySelector("fast-design-system-provider");

        // Example depends on accentFillRest but component itself
        // does not.
        if (provider instanceof FASTDesignSystemProvider) {
            provider.registerCSSCustomProperty(accentFillRestBehavior);
        }
    }
});
