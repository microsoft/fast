import React from "react";
import CSSControlPluginUtilities, {
    CSSControlPluginUtilitiesProps,
} from "./css.plugin.control.utilities";
import CSSStandardControlTemplate from "./css.template.control.standard";

export interface CSSStandardControlPluginProps extends CSSControlPluginUtilitiesProps {}

export default class CSSStandardControlPlugin extends CSSControlPluginUtilities<
    CSSStandardControlPluginProps
> {
    public config: CSSStandardControlPluginProps;

    public render(): React.ReactNode {
        return (
            <CSSStandardControlTemplate
                key={this.config.id}
                {...this.config}
                {...this.props}
            />
        );
    }

    public matches(propertyName: string): boolean {
        return this.config.propertyNames.includes(propertyName);
    }

    public getPropertyNames(): string[] {
        return this.config.propertyNames;
    }
}
