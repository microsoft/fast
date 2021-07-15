import React from "react";
import CSSControlPluginUtilities, {
    CSSControlPluginUtilitiesProps,
} from "./css.plugin.control.utilities";
export interface CSSStandardControlPluginProps extends CSSControlPluginUtilitiesProps {}
export default class CSSStandardControlPlugin extends CSSControlPluginUtilities<
    CSSStandardControlPluginProps
> {
    config: CSSStandardControlPluginProps;
    render(): React.ReactNode;
    matches(propertyName: string): boolean;
    getPropertyNames(): string[];
}
