import React from "react";
import { uniqueId } from "lodash-es";
import styles from "./category.style";
import {
    CategoryClassNameContract,
    CategoryProps,
    CategoryState,
} from "./category.props";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Schema form category component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class Category extends React.Component<
    CategoryProps & ManagedClasses<CategoryClassNameContract>,
    CategoryState
> {
    public static displayName: string = "Category";

    private id: string = uniqueId("category");

    constructor(props: CategoryProps & ManagedClasses<CategoryClassNameContract>) {
        super(props);

        this.state = {
            expanded: this.props.expandable || false,
        };
    }
    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        return (
            <div>
                {this.props.expandable
                    ? this.renderHeaderButton()
                    : this.renderHeaderTitle()}
                <div
                    className={this.getClassNames()}
                    {...this.generateContainerAttributes()}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }

    private generateContainerAttributes(): React.HtmlHTMLAttributes<HTMLDivElement> {
        const attributes: Partial<React.HtmlHTMLAttributes<HTMLDivElement>> = {
            id: this.id,
        };

        if (this.props.expandable) {
            attributes["aria-hidden"] = !this.state.expanded;
        }

        return attributes;
    }

    private handleCategoryCollapse = (): void => {
        this.setState({
            expanded: !this.state.expanded,
        });
    };

    private getClassNames(): string | null {
        return this.props.expandable && !this.state.expanded
            ? this.props.managedClasses.category__collapsed
            : null;
    }

    private renderHeaderButton(): JSX.Element {
        return (
            <button
                onClick={this.handleCategoryCollapse}
                aria-expanded={this.state.expanded}
                aria-controls={this.id}
                className={this.props.managedClasses.category_button}
            >
                {this.props.title}
            </button>
        );
    }

    private renderHeaderTitle(): JSX.Element {
        return (
            <h3 className={this.props.managedClasses.category_header}>
                {this.props.title}
            </h3>
        );
    }
}

export default manageJss(styles)(Category);
