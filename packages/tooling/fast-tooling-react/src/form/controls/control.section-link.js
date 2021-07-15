import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import { classNames, format } from "@microsoft/fast-web-utilities";
import styles from "./control.section-link.style";
import { isDefault } from "./utilities/form";
/**
 * Form control definition
 */
class SectionLinkControl extends React.Component {
    constructor() {
        super(...arguments);
        this.handleUpdateSection = e => {
            this.props.onUpdateSection(
                this.props.dictionaryId,
                this.props.navigationConfigId
            );
        };
    }
    render() {
        const {
            sectionLinkControl,
            sectionLinkControl__disabled,
            sectionLinkControl__default,
            sectionLinkControl__invalid,
        } = this.props.managedClasses;
        return (
            <a
                className={classNames(
                    sectionLinkControl,
                    [sectionLinkControl__disabled, this.props.disabled],
                    [sectionLinkControl__invalid, this.props.invalidMessage !== ""],
                    [
                        sectionLinkControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                onClick={this.handleUpdateSection}
            >
                {format(this.props.strings.sectionLinkEditLabel, this.props.label)}
            </a>
        );
    }
}
SectionLinkControl.displayName = "SectionLinkControl";
SectionLinkControl.defaultProps = {
    managedClasses: {},
};
export { SectionLinkControl };
export default manageJss(styles)(SectionLinkControl);
