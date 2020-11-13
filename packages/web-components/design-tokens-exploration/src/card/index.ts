import { ConfigurationImpl, DesignTokenProvider } from "@microsoft/fast-foundation";
import { Card } from "./card";
import { CardTemplate } from "./card.template";
import { CardStyles } from "./card.styles";

export const FASTCard = ConfigurationImpl.forComponent({
    baseName: "card",
    type: DesignTokenProvider(Card),
    template: CardTemplate,
    styles: CardStyles,
});
