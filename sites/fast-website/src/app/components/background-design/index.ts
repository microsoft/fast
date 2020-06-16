import { customElement } from "@microsoft/fast-element";
import { BackgroundDesign } from "./background-design";
import { BackgroundDesignTemplate as template } from "./background-design.template";
import { BackgroundDesignStyles as styles } from "./background-design.styles";

@customElement({
    name: "background-design",
    styles,
    template,
})
export class SiteBackgroundDesign extends BackgroundDesign {}
