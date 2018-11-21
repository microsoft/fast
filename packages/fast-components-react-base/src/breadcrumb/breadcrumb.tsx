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
    public render(): React.ReactElement<HTMLElement> {
        return (
            <nav
                {...this.unhandledProps()}
                aria-label={this.props.label || null}
                className={this.generateClassNames()}
            >
                <ol className={this.generateItemsContainerClassNames()}>
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
     * Create items container class names
     */
    protected generateItemsContainerClassNames(): string {
        return get(this.props.managedClasses, "breadcrumb_itemsContainer");
    }

    /**
     * Create item class names
     */
    protected generateItemClassNames(): string {
        return get(this.props.managedClasses, "breadcrumb_item") || "";
    }

    /**
     * Create current item class names
     */
    protected generateCurrentItemClassNames(): string {
        return get(this.props.managedClasses, "breadcrumb_item__current") || "";
    }

    /**
     * Create separator class names
     */
    protected generateSeparatorClassNames(): string {
        return get(this.props.managedClasses, "breadcrumb_separator") || "";
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
                        ? `${child.props.className} ${this.generateItemClassNames()}`
                        : this.generateItemClassNames(),
            };

            if (childCount - 1 === index) {
                props.className = `${
                    props.className
                } ${this.generateCurrentItemClassNames()}`;
                props["aria-current"] = "page";
                notLastItem = false;
            }

            augmentedChild = React.cloneElement(child, props);
        }
        return (
            <li>
                {augmentedChild}
                {typeof this.props.separator === "function" && notLastItem
                    ? this.props.separator(this.generateSeparatorClassNames())
                    : null}
            </li>
        );
    };
}

export default Breadcrumb;
export * from "./breadcrumb.props";
export { BreadcrumbClassNameContract };
