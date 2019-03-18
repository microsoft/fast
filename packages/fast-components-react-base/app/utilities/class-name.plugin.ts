import React from "react";
import { ChildOptionItem, Plugin, PluginProps } from "@microsoft/fast-tooling-react";

export default class MapChildrenPropToCallbackPassingClassName extends Plugin<
    PluginProps
> {
    public resolver(data: any, childOption?: ChildOptionItem): any {
        return (className: string): React.ReactNode => {
            return React.createElement(
                childOption.component,
                Object.assign({}, data, { className })
            );
        };
    }
}
