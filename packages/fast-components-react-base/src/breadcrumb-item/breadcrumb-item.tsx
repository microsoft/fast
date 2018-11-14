import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import Hypertext, { HypertextClassNameContract } from "../hypertext";
import { BreadcrumbItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    BreadcrumbItemHandledProps,
    BreadcrumbItemProps,
    BreadcrumbItemUnhandledProps,
} from "./breadcrumb-item.props";

class BreadcrumbItem extends Foundation<
    BreadcrumbItemHandledProps,
    BreadcrumbItemUnhandledProps,
    {}
> {
    public static displayName: string = "BreadcrumbItem";

    public static defaultProps: Partial<BreadcrumbItemProps> = {
        current: false,
    };

    protected handledProps: HandledProps<BreadcrumbItemHandledProps> = {
        managedClasses: void 0,
        children: void 0,
        current: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLLIElement> {
        return (
            <li {...this.unhandledProps()} className={this.generateClassNames()}>
                <Hypertext
                    href={this.props.href}
                    managedClasses={this.mapHypertextClasses()}
                    aria-current={this.props.current ? "page" : undefined}
                >
                    {this.props.children}
                </Hypertext>
            </li>
        );
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        let className: string = get(this.props.managedClasses, "breadcrumbItem") || "";

        if (this.props.current) {
            className = `${className} ${get(
                this.props.managedClasses,
                "breadcrumbItem__current"
            )}`;
        }

        return super.generateClassNames(className);
    }

    /**
     * Maps hypertext managed class to breadcrumb__hypertext
     */
    private mapHypertextClasses(): HypertextClassNameContract {
        return {
            hypertext: get(this.props.managedClasses, "breadcrumbItem_hypertext"),
        };
    }
}

export default BreadcrumbItem;
export * from "./breadcrumb-item.props";
export { BreadcrumbItemClassNameContract };
