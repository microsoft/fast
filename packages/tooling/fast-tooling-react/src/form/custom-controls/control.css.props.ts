import { ControlConfig } from "../templates";
import { CSSPropertiesDictionary } from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";

export interface CSSControlProps extends ControlConfig {
    css: CSSPropertiesDictionary;
}

export interface CSSControlState {
    /**
     * Each key represents a property name and the string as the property value
     */
    [key: string]: string;
}
