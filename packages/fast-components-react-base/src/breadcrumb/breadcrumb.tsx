import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { BreadcrumbClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    BreadcrumbHandledProps,
    BreadcrumbProps,
    BreadcrumbUnhandledProps,
} from "./breadcrumb.props";
import { get } from "lodash-es";

class Breadcrumb extends Foundation<
    BreadcrumbHandledProps,
    BreadcrumbUnhandledProps,
    {}
> {
    public static displayName: string = "Breadcrumb";

    protected handledProps: HandledProps<BreadcrumbHandledProps> = {
        children: void 0,
        label: void 0,
        separator: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): any {
        return (
            <nav
                {...this.unhandledProps()}
                aria-label={this.props.label || null}
                className={this.generateClassNames()}
            >
                <ol className={this.props.managedClasses.breadcrumb_ol}>
                    {this.renderChildren()}
                </ol>
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
     * Render all child elements
     */
    private renderChildren(): React.ReactFragment[] {
        return React.Children.map(this.props.children, this.renderChild);
    }

    private isClonableElement(node: React.ReactNode): node is React.ReactElement<any> {
        return React.isValidElement(node);
    }
    /**
     * Render a single child
     */
    private renderChild = (
        child: React.ReactNode,
        index: number
    ): React.ReactFragment => {
        const childCount: number = React.Children.count(this.props.children);
        let augmentedChild: React.ReactNode = child;
        let notLastItem: boolean = true;
        if (this.isClonableElement(child)) {
            const props: any = {
                className:
                    child.props && typeof child.props.className === "string"
                        ? `${child.props.className} ${
                              this.props.managedClasses.breadcrumb_item
                          }`
                        : this.props.managedClasses.breadcrumb_item,
            };

            if (childCount - 1 === index) {
                props.className = `${props.className} ${
                    this.props.managedClasses.breadcrumb_item__current
                }`;
                props["aria-current"] = "page";
                notLastItem = false;
            }

            augmentedChild = React.cloneElement(child, props);
        }
        return (
            <li>
                {augmentedChild}
                {typeof this.props.separator === "function" && notLastItem
                    ? this.props.separator(this.props.managedClasses.breadcrumb_separator)
                    : null}
            </li>
        );
    };
}

export default Breadcrumb;
export * from "./breadcrumb.props";
export { BreadcrumbClassNameContract };
