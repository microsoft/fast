import * as React from "react";
import {
    ChildOptionItem,
    Plugin,
    PluginProps,
} from "@microsoft/fast-data-utilities-react";

export default class MapChildrenPropToCallbackPassingClassName extends Plugin<
    PluginProps
> {
    public resolver(data: any, childOption?: ChildOptionItem): any {
        return (
            className: string,
            disabled?: boolean,
            appearance?: string
        ): React.ReactNode => {
            const callbackArguments: any = {
                className,
            };
            callbackArguments.disabled =
                typeof disabled === "boolean" ? disabled : undefined;
            callbackArguments.appearance =
                typeof appearance === "string" ? appearance : undefined;

            return React.createElement(
                childOption.component,
                Object.assign({}, data, callbackArguments)
            );
        };
    }
}
