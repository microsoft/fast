import React from "react";
import { ChildOptionItem, Plugin, PluginProps } from "@microsoft/fast-tooling-react";

export default class MapChildrenPropToCallbackPassingArguments extends Plugin<
    PluginProps
> {
    public resolver(data: any, childOption: ChildOptionItem): any {
        return (className?: string): React.ReactNode => {
            const updatedData: { [key: string]: any } = {};

            if (typeof className !== "undefined") {
                updatedData.className = className;
            }

            return React.createElement(
                childOption.component,
                Object.assign({}, data, updatedData)
            );
        };
    }
}
