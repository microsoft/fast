import { MSFTDesignSystemProvider } from "../design-system-provider";
import CardTemplate from "./fixtures/card.html";
import { MSFTCard } from "./";

// Prevent tree-shaking
MSFTCard;
MSFTDesignSystemProvider;

export default {
    title: "Card",
};

export const Card = () => CardTemplate;
