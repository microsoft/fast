import * as React from "react";
import IFormItemCommon from "./form-item";
import styles from "./form-category.style";
import { IFormCategoryClassNameContract } from "../class-name-contracts/";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Select state interface
 */
export interface IFormCategoryProps {

    /**
     * Passes the category item
     */
    categoryItem: JSX.Element[];

    /**
     * Passes the category title
     */
    title: string;

    /**
     * Is the category expanded
     */
    isExpanded?: boolean;

    /**
     * Passes the id
     */
    id: string;
}

export interface IFormCategoryState {
    isCategoryExpanded: boolean;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormCategory extends React.Component<IFormCategoryProps & IManagedClasses<IFormCategoryClassNameContract>, IFormCategoryState> {

    constructor(props: IFormCategoryProps & IManagedClasses<IFormCategoryClassNameContract>) {
        super(props);

        this.state = {
            isCategoryExpanded: this.props.isExpanded || true
        };
    }
    /**
     * Renders the component
     */
    public render(): JSX.Element {
        // Exit if the array is only one item long and that item is null or undefined
        if (this.props.categoryItem.length < 1 && this.props.categoryItem[0] === null ||
            this.props.categoryItem.length < 1 && this.props.categoryItem[0] === undefined) {
            return;
        }

        return (
            <div key={this.props.title}>
                <button
                    onClick={this.handleCategoryCollapse}
                    aria-expanded={this.state.isCategoryExpanded}
                    aria-controls={this.props.id}
                    className={this.props.managedClasses.formCategory_button}
                >
                        {this.props.title}
                </button>
                <div
                    id={this.props.id}
                    className={this.getClassNames()}
                    aria-hidden={!this.state.isCategoryExpanded}
                >
                    {this.props.categoryItem}
                </div>
            </div>
        );
    }

    private handleCategoryCollapse = (): void => {
        this.setState({
            isCategoryExpanded: !this.state.isCategoryExpanded
        });
    }

    private getClassNames(): string {
        const classNames: string = this.state.isCategoryExpanded
            ? this.props.managedClasses.formCategory
            : this.props.managedClasses.formCategory__collapsed;

        return classNames;
    }
}

export default manageJss(styles)(FormCategory);
