import { demoCardStyles as styles } from "./card.styles";
import { template } from "./card.template";
import { DemoCard, DemoCardDefinitionOptions } from "./card";

/**
 * For more complex components, it may be good to separate the class, template,
 * and styles into their own files. That's what has been done with this example
 * component. When following this pattern, an index file can then be created where
 * the component is composed and/or where all the component pieces are exported.
 *
 * Below the template and styles are composed with the DemoCard class to create a
 * component that is configurable through the DesignSystem API. See the main.ts file
 * for how the demoCard function is used. As an experiment, try using that API to
 * override the likeButton slot content.
 */
export const demoCard = DemoCard.compose<DemoCardDefinitionOptions>({
    baseName: "demo-card",
    template,
    styles,
});

export * from "./card";
