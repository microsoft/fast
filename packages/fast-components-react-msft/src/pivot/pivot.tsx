import * as React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    PivotHandledProps,
    PivotManagedClasses,
    PivotUnhandledProps,
} from "./pivot.props";
import { TabsClassNameContract } from "@microsoft/fast-components-react-base";
import { Tabs as BaseTabs } from "@microsoft/fast-components-react-base";

class Pivot extends Foundation<PivotHandledProps, PivotUnhandledProps, {}> {
    public static displayName: string = "Pivot";

    protected handledProps: HandledProps<PivotHandledProps> = {
        afterContent: void 0,
        label: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <BaseTabs
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                managedClasses={this.generatePivotClassNames()}
                items={this.props.items}
                label={this.props.label}
            />
        );
    }

    /**
     * Returns tabs managedclasses with new carousel-specific JSS
     */
    protected generatePivotClassNames(): TabsClassNameContract {
        return {
            tabs: get(this.props, "managedClasses.pivot", ""),
            tabs_tabPanels: get(this.props, "managedClasses.pivot_tabPanels", ""),
            tabs_tabList: get(this.props, "managedClasses.pivot_itemList", ""),
            tabs_tabPanelContent: get(
                this.props,
                "managedClasses.pivot_tabPanelContent",
                ""
            ),
            tab: get(this.props, "managedClasses.pivot_item", ""),
            tab__active: get(this.props, "managedClasses.pivot_item__active", ""),
            tabPanel: get(this.props, "managedClasses.pivot_tabPanel", ""),
            tabPanel__hidden: get(
                this.props,
                "managedClasses.pivot_tabPanel__hidden",
                ""
            ),
        };
    }
}

export default Pivot;
export * from "./pivot.props";
