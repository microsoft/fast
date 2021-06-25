import { demoCardStyles as styles } from "./styles";
import { template } from "./template";
import { DemoCard, DemoCardDefinitionOptions } from "./demo-card";

export const demoCardDefinition = DemoCard.compose<DemoCardDefinitionOptions>({
    baseName: "demo-card",
    template,
    styles,
});

export * from "./demo-card";
