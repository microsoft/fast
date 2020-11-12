import { ConfigurationImpl, DesignTokenProvider } from "@microsoft/fast-foundation";
import { Card } from "./card";

export const FASTCard = ConfigurationImpl.forComponent({
    baseName: "card",
    type: DesignTokenProvider(Card),
});
// @customElement({
//     name: "fast-card",
//     template: CardTemplate,
// })
// export class FASTCard extends  {}
