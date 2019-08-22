import { TabClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import { TabHandledProps, TabProps, TabUnhandledProps } from "./tab.props";

class Tab extends Foundation<TabHandledProps, TabUnhandledProps, {}> {
    public static defaultProps: Partial<TabProps> = {
        active: false,
        managedClasses: {},
    };

    public static displayName: string = `${DisplayNamePrefix}Tab`;

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
        const { tab, tab__active }: TabClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(tab, [tab__active, this.props.active])
        );
    }
}

export default Tab;
export * from "./tab.props";
