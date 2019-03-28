import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import styles from "./form-item.section-link.style";
import {
    FormItemSectionLinkClassNameContract,
    FormItemSectionLinkProps,
} from "./form-item.section-link.props";
import FormItemBase from "./form-item.base";

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
                {this.renderBadge(
                    get(this.props, "managedClasses.formItemSectionLink_badge")
                )}
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
