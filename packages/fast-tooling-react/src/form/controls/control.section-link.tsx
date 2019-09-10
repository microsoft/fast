import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import styles from "./control.section-link.style";
import {
    SectionLinkFormControlClassNameContract,
    SectionLinkFormControlProps,
} from "./control.section-link.props";
import BaseFormControl from "./template.control.abstract";

/**
 * Schema form component definition
 * @extends BaseFormControl
 */
/* tslint:disable-next-line */
class SectionLinkFormControl extends BaseFormControl<
    SectionLinkFormControlProps & ManagedClasses<SectionLinkFormControlClassNameContract>,
    {}
> {
    public static displayName: string = "SectionLinkFormControl";

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.sectionLinkFormControl}>
                <div
                    className={get(
                        this.props,
                        "managedClasses.sectionLinkFormControl_controlRegion"
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
                            "managedClasses.sectionLinkFormControl_defaultValueIndicator"
                        )
                    )}
                    {this.renderBadge(
                        get(this.props, "managedClasses.sectionLinkFormControl_badge")
                    )}
                    <div
                        className={
                            this.props.managedClasses.sectionLinkFormControl_softRemove
                        }
                    >
                        {this.renderSoftRemove(
                            this.props.managedClasses
                                .sectionLinkFormControl_softRemoveInput
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(
                        this.props,
                        "managedClasses.sectionLinkFormControl_invalidMessage"
                    )
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
            "managedClasses.sectionLinkFormControl_anchor"
        );

        if (this.props.invalidMessage !== "") {
            classes += ` ${get(
                this.props,
                "managedClasses.sectionLinkFormControl_anchor__invalid"
            )}`;
        }

        return classes;
    }
}

export { SectionLinkFormControl };
export default manageJss(styles)(SectionLinkFormControl);
