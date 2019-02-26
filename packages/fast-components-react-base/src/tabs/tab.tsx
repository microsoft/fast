import * as React from "react";
import { get } from "lodash-es";
import {
    ManagedClasses,
    TabClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    TabHandledProps,
    TabManagedClasses,
    TabProps,
    TabUnhandledProps,
} from "./tab.props";

class Tab extends Foundation<TabHandledProps, TabUnhandledProps, {}> {
    public static defaultProps: Partial<TabProps> = {
        active: false,
    };

    public static displayName: string = "Tab";

    protected handledProps: HandledProps<TabHandledProps> = {
        managedClasses: void 0,
        active: void 0,
        slot: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <div
                {...this.unhandledProps()}
                role="tab"
                aria-selected={this.props.active}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        return this.props.active
            ? super.generateClassNames(
                  `${get(this.props, "managedClasses.tab", "")} ${get(
                      this.props,
                      "managedClasses.tab__active",
                      ""
                  )}`
              )
            : super.generateClassNames(get(this.props, "managedClasses.tab", ""));
    }
}

export default Tab;
export * from "./tab.props";
