import React from "react";
import { Plugin, PluginProps } from "../../index";
import { ChildOptionItem } from "../../index";

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
