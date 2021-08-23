import { CSSPropertiesDictionary } from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { ControlConfig } from "../templates";
import { CSSStandardControlPlugin } from "./css";

export interface CSSControlProps extends ControlConfig {
    /**
     * The subset of CSS properties that will be used to generate UI.
     */
    css: CSSPropertiesDictionary;

    /**
     * Control overrides for one or more CSS properties.
     */
    cssControls?: CSSStandardControlPlugin[];
}
