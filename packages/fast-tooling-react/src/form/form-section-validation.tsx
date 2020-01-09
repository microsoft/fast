import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import {
    FormSectionValidationClassNameContract,
    FormSectionValidationProps,
    FormSectionValidationState,
} from "./form-section-validation.props";
import styles from "./form-section-validation.style";
import { ErrorObject } from "ajv";
import { classNames } from "@microsoft/fast-web-utilities";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormSectionValidation extends React.Component<
    FormSectionValidationProps & ManagedClasses<FormSectionValidationClassNameContract>,
    FormSectionValidationState
> {
    private validationIdentifier: string = "validation";

    constructor(props: FormSectionValidationProps) {
        super(props);

        this.state = {
            expanded: false,
        };
    }

    public render(): React.ReactNode {
        return (
            <div className={this.props.managedClasses.formSectionValidation}>
                {this.renderExpandTrigger()}
                <div
                    className={
                        this.props.managedClasses.formSectionValidation_controlRegion
                    }
                >
                    {this.renderInvalidMessage()}
                    {this.renderValidationErrorContainer()}
                </div>
            </div>
        );
    }

    private renderInvalidMessage(): React.ReactNode {
        return (
            <div
                className={this.props.managedClasses.formSectionValidation_message}
                title={this.props.invalidMessage}
            >
                {this.props.invalidMessage}
            </div>
        );
    }

    private renderExpandTrigger(): React.ReactNode {
        if (this.props.validationErrors.length > 1) {
            return (
                <button
                    className={classNames(
                        this.props.managedClasses.formSectionValidation_expandTrigger,
                        [
                            this.props.managedClasses
                                .formSectionValidation_expandTrigger__active,
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

    private renderValidationErrorContainer(): React.ReactNode {
        return (
            <ul
                id={this.getId()}
                className={this.props.managedClasses.formSectionValidation_errorList}
            >
                {this.renderAllValidationErrors()}
            </ul>
        );
    }

    private renderAllValidationErrors(): React.ReactNode {
        if (this.state.expanded) {
            return this.props.validationErrors.map(
                (validationError: ErrorObject, index: number): React.ReactNode => {
                    return (
                        <li
                            key={`${this.props.dataLocation}${index}`}
                            className={
                                this.props.managedClasses
                                    .formSectionValidation_errorListItem
                            }
                        >
                            <span title={validationError.message}>
                                {validationError.message}
                            </span>
                            <div
                                className={
                                    this.props.managedClasses
                                        .formSectionValidation_errorListItemDetails
                                }
                                title={`Ajv dataPath: ${validationError.dataPath}`}
                            >
                                {validationError.dataPath}
                            </div>
                        </li>
                    );
                }
            );
        }
    }

    private handleExpandTrigger = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();

        this.setState({
            expanded: !this.state.expanded,
        });
    };

    private getId(): string {
        return `${this.props.dataLocation}${this.validationIdentifier}`;
    }
}

export { FormSectionValidation };
export default manageJss(styles)(FormSectionValidation);
