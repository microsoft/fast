import { css } from "@microsoft/fast-element";
import { ConfigurationImpl, DesignTokenProvider } from "@microsoft/fast-foundation";
import { Card } from "./card";
import { CardTemplate } from "./card.template";

export const FASTCard = ConfigurationImpl.forComponent({
    baseName: "card",
    type: DesignTokenProvider(Card),
    template: CardTemplate,
    styles: css`
        :host {
            display: block;
        }
    `,
});
