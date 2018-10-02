import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ITabItemHandledProps, ITabItemUnhandledProps } from "./tab-item.props";

class TabItem extends Foundation<
    ITabItemHandledProps,
    ITabItemUnhandledProps,
    {}
> {
    public static displayName: string = "TabItem";
}

export default TabItem;
export * from "./tab-item.props";
