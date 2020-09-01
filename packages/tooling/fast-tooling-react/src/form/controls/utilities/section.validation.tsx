import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import {
    SectionValidationClassNameContract,
    SectionValidationProps,
    SectionValidationState,
} from "./section.validation.props";
import styles from "./section.validation.style";
import { ValidationError } from "@microsoft/fast-tooling";
import { classNames } from "@microsoft/fast-web-utilities";

/**
 * Schema form component definition
 * @extends React.Component
 */
class SectionValidation extends React.Component<
    SectionValidationProps & ManagedClasses<SectionValidationClassNameContract>,
    SectionValidationState
> {
    private validationIdentifier: string = "validation";

    constructor(props: SectionValidationProps) {
        super(props);

        this.state = {
            expanded: false,
        };
    }

    public render(): React.ReactNode {
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

    private renderInvalidMessage(): React.ReactNode {
        return (
            <div
                className={this.props.managedClasses.sectionValidation_message}
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

    private renderValidationErrorContainer(): React.ReactNode {
        return (
            <ul
                id={this.getId()}
                className={this.props.managedClasses.sectionValidation_errorList}
            >
                {this.renderAllValidationErrors()}
            </ul>
        );
    }

    private renderAllValidationErrors(): React.ReactNode {
        if (this.state.expanded) {
            return this.props.validationErrors.map(
                (validationError: ValidationError, index: number): React.ReactNode => {
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

export { SectionValidation };
export default manageJss(styles)(SectionValidation);
