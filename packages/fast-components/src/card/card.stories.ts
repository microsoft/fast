import { FASTCard } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import CardTemplate from "./fixtures/card.html";

// Prevent tree-shaking
FASTCard;
FASTDesignSystemProvider;

export default {
    title: "Card",
};

export const Card = () => CardTemplate;
