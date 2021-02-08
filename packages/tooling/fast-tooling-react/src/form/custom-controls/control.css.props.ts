import { CSSPropertiesDictionary } from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { ControlConfig } from "../templates";

export interface CSSControlProps extends ControlConfig {
    css: CSSPropertiesDictionary;
}

export interface CSSControlState {
    /**
     * Each key represents a property name and the string as the property value
     */
    [key: string]: string;
}
