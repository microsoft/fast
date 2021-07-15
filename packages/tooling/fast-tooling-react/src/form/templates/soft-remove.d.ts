import React from "react";
export interface SoftRemoveProps {
    /**
     * The className to apply to the input element
     */
    className: string;
    /**
     * The checked value for the input element
     */
    checked: boolean;
    /**
     * The disabled state for the input element
     */
    disabled: boolean;
    /**
     * The onChange callback
     */
    onChange: () => void;
}
/**
 * A component that allows:
 * - deletion of data which is intended to be cached
 * - addition of the removed data via a cache
 * @extends React.Component
 */
declare class SoftRemove extends React.Component<SoftRemoveProps, {}> {
    render(): JSX.Element;
    private renderIcon;
}
export default SoftRemove;
