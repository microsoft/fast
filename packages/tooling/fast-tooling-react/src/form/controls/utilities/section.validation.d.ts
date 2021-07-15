import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import {
    SectionValidationClassNameContract,
    SectionValidationProps,
    SectionValidationState,
} from "./section.validation.props";
/**
 * Schema form component definition
 * @extends React.Component
 */
declare class SectionValidation extends React.Component<
    SectionValidationProps & ManagedClasses<SectionValidationClassNameContract>,
    SectionValidationState
> {
    private validationIdentifier;
    constructor(props: SectionValidationProps);
    render(): React.ReactNode;
    private renderInvalidMessage;
    private renderExpandTrigger;
    private renderValidationErrorContainer;
    private renderAllValidationErrors;
    private handleExpandTrigger;
    private getId;
}
export { SectionValidation };
declare const _default: React.ComponentClass<
    ManagedJSSProps<SectionValidationProps, SectionValidationClassNameContract, {}>,
    any
>;
export default _default;
