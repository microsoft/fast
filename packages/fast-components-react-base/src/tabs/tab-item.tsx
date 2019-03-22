import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TabItemHandledProps, TabItemUnhandledProps } from "./tab-item.props";
import { DisplayNamePrefix } from "../utilities";

class TabItem extends Foundation<TabItemHandledProps, TabItemUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}TabItem`;
}

export default TabItem;
export * from "./tab-item.props";
