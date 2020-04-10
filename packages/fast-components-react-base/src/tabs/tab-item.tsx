import Foundation from "@microsoft/fast-components-foundation-react";
import { DisplayNamePrefix } from "../utilities";
import { TabItemHandledProps, TabItemUnhandledProps } from "./tab-item.props";

class TabItem extends Foundation<TabItemHandledProps, TabItemUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}TabItem`;
}

export default TabItem;
export * from "./tab-item.props";
