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
 * @extends FormItemBase
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
                <div
                    className={get(
                        this.props,
                        "managedClasses.formItemSectionLink_controlRegion"
                    )}
                >
                    <a
                        className={this.getAnchorClassNames()}
                        onClick={this.handleUpdateSection}
                    >
                        {this.props.label}
                    </a>
                    {this.renderDefaultValueIndicator(
                        get(
                            this.props,
                            "managedClasses.formItemSectionLink_defaultValueIndicator"
                        )
                    )}
                    {this.renderBadge(
                        get(this.props, "managedClasses.formItemSectionLink_badge")
                    )}
                    <div
                        className={
                            this.props.managedClasses.formItemSectionLink_softRemove
                        }
                    >
                        {this.renderSoftRemove(
                            this.props.managedClasses.formItemSectionLink_softRemoveInput
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(this.props, "managedClasses.formItemSectionLink_invalidMessage")
                )}
            </div>
        );
    }

    private handleUpdateSection = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        this.props.onUpdateSection(this.props.schemaLocation, this.props.dataLocation);
    };

    private getAnchorClassNames(): string {
        let classes: string = get(
            this.props,
            "managedClasses.formItemSectionLink_anchor"
        );

        if (this.props.invalidMessage !== "") {
            classes += ` ${get(
                this.props,
                "managedClasses.formItemSectionLink_anchor__invalid"
            )}`;
        }

        return classes;
    }
}

export { FormItemSectionLink };
export default manageJss(styles)(FormItemSectionLink);
