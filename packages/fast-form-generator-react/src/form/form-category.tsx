import * as React from "react";
import FormItemCommon from "./form-item";
import styles from "./form-category.style";
import { FormCategoryClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Select state interface
 */
export interface FormCategoryProps {
    /**
     * Passes the category item
     */
    categoryItem: JSX.Element[];

    /**
     * Passes the category title
     */
    title: string;

    /**
     * Is the category expandable
     */
    expandable?: boolean;

    /**
     * Passes the id
     */
    id?: string;
}

export interface FormCategoryState {
    expanded?: boolean;
}

/**
 * Schema form category component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormCategory extends React.Component<
    FormCategoryProps & ManagedClasses<FormCategoryClassNameContract>,
    FormCategoryState
> {
    constructor(
        props: FormCategoryProps & ManagedClasses<FormCategoryClassNameContract>
    ) {
        super(props);

        if (this.props.expandable) {
            this.state = {
                expanded: true,
            };
        }
    }
    /**
     * Renders the component
     */
    public render(): JSX.Element {
        // Exit if the array is only one item long and that item is null or undefined
        if (
            (this.props.categoryItem.length < 1 && this.props.categoryItem[0] === null) ||
            (this.props.categoryItem.length < 1 &&
                this.props.categoryItem[0] === undefined)
        ) {
            return;
        }

        return (
            <div key={this.props.id}>
                {this.props.expandable
                    ? this.renderHeaderButton()
                    : this.renderHeaderTitle()}
                <div
                    className={this.getClassNames()}
                    {...this.generateContainerAttributes()}
                >
                    {this.props.categoryItem}
                </div>
            </div>
        );
    }

    private generateContainerAttributes(): React.HtmlHTMLAttributes<HTMLDivElement> {
        const attributes: Partial<React.HtmlHTMLAttributes<HTMLDivElement>> = {
            id: this.props.id,
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
            ? this.props.managedClasses.formCategory__collapsed
            : null;
    }

    private renderHeaderButton(): JSX.Element {
        return (
            <button
                onClick={this.handleCategoryCollapse}
                aria-expanded={this.state.expanded}
                aria-controls={this.props.id}
                className={this.props.managedClasses.formCategory_button}
            >
                {this.props.title}
            </button>
        );
    }

    private renderHeaderTitle(): JSX.Element {
        return (
            <h3 className={this.props.managedClasses.formCategory_header}>
                {this.props.title}
            </h3>
        );
    }
}

export default manageJss(styles)(FormCategory);
