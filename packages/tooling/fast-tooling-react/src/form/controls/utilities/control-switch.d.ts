import React from "react";
import { ControlSwitchProps } from "./control-switch.props";
declare class ControlSwitch extends React.Component<ControlSwitchProps, {}> {
    static displayName: string;
    render(): React.ReactNode;
    /**
     * Renders form items
     */
    private renderControl;
    private getControlType;
    private renderDataLink;
    /**
     * Renders the array form item
     */
    private renderArray;
    /**
     * Renders the number field form item
     */
    private renderNumberField;
    /**
     * Renders the checkbox form item
     */
    private renderCheckbox;
    /**
     * Renders a section link for properties
     * that are objects
     */
    private renderSectionLink;
    /**
     * Renders the textarea form item
     */
    private renderTextarea;
    /**
     * Renders the select form item
     */
    private renderSelect;
    /**
     * Renders the display form item
     */
    private renderDisplay;
    private renderButton;
    private handleAddExampleData;
    /**
     * Gets the common form control props
     */
    private getCommonControlProps;
    /**
     * Determine whether this control can be soft-removed
     * which allows undo/redo for the last stored value
     */
    private shouldBeSoftRemovable;
}
export default ControlSwitch;
export { ControlSwitchProps };
