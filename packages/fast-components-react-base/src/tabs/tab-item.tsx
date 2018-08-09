import * as React from "react";
import Foundation, { HandledProps } from "../foundation";
import { ITabItemHandledProps, ITabItemUnhandledProps } from "./tab-item.props";

class TabItem extends Foundation<ITabItemHandledProps, ITabItemUnhandledProps, {}> {}

export default TabItem;
export * from "./tab-item.props";
