import { Card } from "@microsoft/fast-components";
import { template } from "./template";
import { styles } from "./styles";

export class DemoCard extends Card {
    constructor() {
        super();
    }
}

export const demoCardDefinition = DemoCard.compose({
    baseName: "demo-card",
    template,
    styles,
});
