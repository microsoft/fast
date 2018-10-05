import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TabItemHandledProps, TabItemUnhandledProps } from "./tab-item.props";

class TabItem extends Foundation<
    TabItemHandledProps,
    TabItemUnhandledProps,
    {}
> {
    public static displayName: string = "TabItem";
}

export default TabItem;
export * from "./tab-item.props";
