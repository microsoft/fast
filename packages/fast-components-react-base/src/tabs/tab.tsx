import * as React from "react";
import { get } from "lodash-es";
import { IManagedClasses, ITabClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ITabHandledProps, ITabManagedClasses, ITabUnhandledProps, TabProps } from "./tab.props";

class Tab extends Foundation<
    ITabHandledProps,
    ITabUnhandledProps,
    {}
> {
    public static defaultProps: Partial<TabProps> = {
        active: false
    };

    public static displayName: string = "Tab";

    protected handledProps: HandledProps<ITabHandledProps> = {
        managedClasses: void 0,
        active: void 0,
        slot: void 0
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
            ? super.generateClassNames(`${get(this.props, "managedClasses.tab")} ${get(this.props, "managedClasses.tab__active")}`)
            : super.generateClassNames(get(this.props, "managedClasses.tab"));
    }
}

export default Tab;
export * from "./tab.props";
