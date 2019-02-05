import * as React from "react";
import FormItemCommon from "./form-item";
import styles from "./form-item.section-link.style";
import { FormItemSectionLinkClassNameContract } from "../class-name-contracts";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormItemBase from "./form-item.base";

/**
 * SectionLink state interface
 */
export interface FormItemSectionLinkProps extends FormItemCommon {
    /**
     * The schema location
     */
    schemaLocation: string;

    /**
     * The update section callback
     */
    onUpdateSection: (schemaLocation: string, dataLocation: string) => void;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemSectionLink extends FormItemBase<
    FormItemSectionLinkProps & ManagedClasses<FormItemSectionLinkClassNameContract>,
    {}
> {
    public static displayName: string = "FormItemSectionLink";

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.formItemSectionLink}>
                <a
                    className={this.props.managedClasses.formItemSectionLink_anchor}
                    onClick={this.handleUpdateSection}
                >
                    {this.props.label}
                </a>
                <div className={this.props.managedClasses.formItemSectionLink_softRemove}>
                    {this.renderSoftRemove(
                        this.props.managedClasses.formItemSectionLink_softRemoveInput
                    )}
                </div>
            </div>
        );
    }

    private handleUpdateSection = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        if (this.props.data === undefined) {
            this.props.onChange(this.props.dataLocation, {});
        }

        this.props.onUpdateSection(this.props.schemaLocation, this.props.dataLocation);
    };
}

export default manageJss(styles)(FormItemSectionLink);
