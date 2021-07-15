import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import {
    SectionControlClassNameContract,
    SectionControlProps,
    SectionControlState,
} from "./control.section.props";
/**
 * Schema form component definition
 * @extends React.Component
 */
declare class SectionControl extends React.Component<
    SectionControlProps & ManagedClasses<SectionControlClassNameContract>,
    SectionControlState
> {
    static displayName: string;
    static defaultProps: Partial<
        SectionControlProps & ManagedClasses<SectionControlClassNameContract>
    >;
    static getDerivedStateFromProps(
        props: SectionControlProps,
        state: SectionControlState
    ): Partial<SectionControlState>;
    /**
     * The message system registration configuration
     */
    private messageSystemConfig;
    /**
     * The ID of the requested validation
     */
    private oneOfAnyOfValidationRequestId;
    constructor(
        props: SectionControlProps & ManagedClasses<SectionControlClassNameContract>
    );
    render(): React.ReactNode;
    /**
     * React lifecycle hook
     */
    componentDidUpdate(prevProps: SectionControlProps): void;
    /**
     * React lifecycle hook
     */
    componentWillUnmount(): void;
    /**
     * Handle the message system messages
     */
    private handleMessageSystem;
    /**
     * Handles updating the schema to another active oneOf/anyOf schema
     */
    private handleAnyOfOneOfClick;
    /**
     * Generates form elements based on field type
     */
    private renderFormControl;
    private getFormControl;
    private getFormControls;
    /**
     * Renders a select if the root level has a oneOf or anyOf
     */
    private renderAnyOfOneOfSelect;
    /**
     * Renders additional properties if they have been declared
     */
    private renderAdditionalProperties;
    private renderFormValidation;
    private renderSectionControl;
    private handleCategoryExpandTriggerClick;
    private getActiveTreeNavigationItem;
    /**
     * Get all enumerated properties for the object
     */
    private getEnumeratedProperties;
    private isDisabled;
}
export { SectionControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, SectionControlClassNameContract, {}>,
    any
>;
export default _default;
