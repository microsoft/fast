import * as React from "react";
import { get } from "lodash-es";
import { IManagedClasses, ITabClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "../foundation";
import { ITabHandledProps, ITabManagedClasses, ITabUnhandledProps } from "./tab.props";

class Tab extends Foundation<ITabHandledProps & ITabManagedClasses, ITabUnhandledProps, {}> {
    protected handledProps: HandledProps<ITabHandledProps & IManagedClasses<ITabClassNameContract>> = {
        managedClasses: void 0,
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
        return this.unhandledProps()["aria-selected"]
            ? super.generateClassNames(`${get(this.props, "managedClasses.tab")} ${get(this.props, "managedClasses.tab__active")}`)
            : super.generateClassNames(get(this.props, "managedClasses.tab"));
    }
}

export default Tab;
export * from "./tab.props";
