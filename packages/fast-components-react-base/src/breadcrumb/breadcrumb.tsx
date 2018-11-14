import * as ReactDOM from "react-dom";
import { BreadcrumbItemProps } from "../breadcrumb-item";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { BreadcrumbClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    BreadcrumbHandledProps,
    BreadcrumbProps,
    BreadcrumbUnhandledProps,
} from "./breadcrumb.props";
import { get } from "lodash-es";
import * as React from "react";

class Breadcrumb extends Foundation<
    BreadcrumbHandledProps,
    BreadcrumbUnhandledProps,
    {}
> {
    public static displayName: string = "Breadcrumb";

    protected handledProps: HandledProps<BreadcrumbHandledProps> = {
        children: void 0,
        label: void 0,
        seperator: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <nav
                {...this.unhandledProps()}
                aria-label={this.props.label}
                className={this.generateClassNames()}
            >
                <ol className={this.generateOlClassNames()}>{this.renderChildren()}</ol>
            </nav>
        );
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "breadcrumb"));
    }

    /**
     * Create class names
     */
    protected generateOlClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "breadcrumb_ol"));
    }

    /**
     * Render all child elements
     */
    private renderChildren(): React.ReactFragment[] {
        return React.Children.map(this.props.children, this.renderChild);
    }

    /**
     * Render a single child
     */
    private renderChild = (
        child: React.ReactElement<BreadcrumbItemProps>,
        index: number
    ): React.ReactFragment => {
        const childCount: number = React.Children.count(this.props.children);
        if (childCount - 1 === index) {
            return React.cloneElement(child, {
                current: true,
                href: undefined,
            });
        }
        return (
            <React.Fragment>
                {child}
                {typeof this.props.seperator === "function"
                    ? this.props.seperator(this.props.managedClasses.breadcrumb_seperator)
                    : null}
            </React.Fragment>
        );
    };
}

export default Breadcrumb;
export * from "./breadcrumb.props";
export { BreadcrumbClassNameContract };
