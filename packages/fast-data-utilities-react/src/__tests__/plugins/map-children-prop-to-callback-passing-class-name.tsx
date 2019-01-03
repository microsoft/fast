import * as React from "react";
import { Plugin, PluginProps } from "../../";
import { ChildOptionItem } from "../../";

export default class MapChildrenPropToCallbackPassingClassName extends Plugin<
    PluginProps
> {
    public resolver(data: any, childOption?: ChildOptionItem): any {
        return (className: string): React.ReactNode => {
            return React.createElement(
                childOption.component,
                Object.assign({}, data.props, { className })
            );
        };
    }
}
