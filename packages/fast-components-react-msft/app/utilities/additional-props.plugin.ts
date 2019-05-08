import React from "react";
import { ChildOptionItem, Plugin, PluginProps } from "@microsoft/fast-tooling-react";

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

            if (disabled) {
                callbackArguments.disabled = disabled;
            }

            if (appearance) {
                callbackArguments.appearance = appearance;
            }

            return React.createElement(
                childOption.component,
                Object.assign({}, data, callbackArguments)
            );
        };
    }
}
