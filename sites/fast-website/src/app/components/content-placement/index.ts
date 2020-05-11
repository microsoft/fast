import { customElement } from "@microsoft/fast-element";
import { ContentPlacement } from "./content-placement";
import { ContentPlacementTemplate as template } from "./content-placement.template";
import { ContentPlacementStyles as styles } from "./content-placement.styles";

@customElement({
    name: "fast-content-placement",
    template,
    styles,
})
export class FASTContentPlacement extends ContentPlacement {}
export * from "./content-placement.template";
export * from "./content-placement.styles";
export * from "./content-placement";
