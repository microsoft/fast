import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./section.validation.style";
import { classNames } from "@microsoft/fast-web-utilities";
/**
 * Schema form component definition
 * @extends React.Component
 */
class SectionValidation extends React.Component {
    constructor(props) {
        super(props);
        this.validationIdentifier = "validation";
        this.handleExpandTrigger = e => {
            e.preventDefault();
            this.setState({
                expanded: !this.state.expanded,
            });
        };
        this.state = {
            expanded: false,
        };
    }
    render() {
        return (
            <div className={this.props.managedClasses.sectionValidation}>
                {this.renderExpandTrigger()}
                <div
                    className={this.props.managedClasses.sectionValidation_controlRegion}
                >
                    {this.renderInvalidMessage()}
                    {this.renderValidationErrorContainer()}
                </div>
            </div>
        );
    }
    renderInvalidMessage() {
        return (
            <div
                className={this.props.managedClasses.sectionValidation_message}
                title={this.props.invalidMessage}
            >
                {this.props.invalidMessage}
            </div>
        );
    }
    renderExpandTrigger() {
        if (this.props.validationErrors.length > 1) {
            return (
                <button
                    className={classNames(
                        this.props.managedClasses.sectionValidation_expandTrigger,
                        [
                            this.props.managedClasses
                                .sectionValidation_expandTrigger__active,
                            this.state.expanded,
                        ]
                    )}
                    onClick={this.handleExpandTrigger}
                    aria-expanded={this.state.expanded}
                    aria-controls={this.getId()}
                    title={"Expand to see full error list"}
                />
            );
        }
    }
    renderValidationErrorContainer() {
        return (
            <ul
                id={this.getId()}
                className={this.props.managedClasses.sectionValidation_errorList}
            >
                {this.renderAllValidationErrors()}
            </ul>
        );
    }
    renderAllValidationErrors() {
        if (this.state.expanded) {
            return this.props.validationErrors.map((validationError, index) => {
                return (
                    <li
                        key={`${this.props.dataLocation}${index}`}
                        className={
                            this.props.managedClasses.sectionValidation_errorListItem
                        }
                    >
                        <span title={validationError.invalidMessage}>
                            {validationError.invalidMessage}
                        </span>
                        <div
                            className={
                                this.props.managedClasses
                                    .sectionValidation_errorListItemDetails
                            }
                            title={`data location: ${validationError.dataLocation}`}
                        >
                            {validationError.dataLocation}
                        </div>
                    </li>
                );
            });
        }
    }
    getId() {
        return `${this.props.dataLocation}${this.validationIdentifier}`;
    }
}
export { SectionValidation };
export default manageJss(styles)(SectionValidation);
