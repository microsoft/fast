import { customElement } from "@microsoft/fast-element";
import { ContentPlacementContainer } from "./content-placement-container";
import { ContentPlacementContainerTemplate as template } from "./content-placement-container.template";
import { ContentPlacementContainerStyles as styles } from "./content-placement-container.styles";

@customElement({
    name: "site-content-placement-container",
    template,
    styles,
})
export class SiteContentPlacementContainer extends ContentPlacementContainer {}
export * from "./content-placement-container.template";
export * from "./content-placement-container.styles";
export * from "./content-placement-container";