import * as React from "react";

// export interface ICheckboxProps {

//     children?: React.ReactNode | React.ReactNode[];
// }
export interface ICheckboxItemCommon {

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The checked state
     */
    checked?: boolean;

    /**
     * The indeterminate option
     */
    indeterminate?: boolean;

    /**
     * The HTML id attribute
     */
    id: string;

    /**
     * The HTML name attribute
     */
    name: string;

    /**
     * The HTML value attribute
     */
    value: string;

    /**
     * The textual content
     */
    text: string;
}

export interface ICheckboxProps {

    /**
     * The checkbox items
     */
    items: ICheckboxItem[];
}

export interface ICheckboxItem extends ICheckboxItemCommon {

    /**
     * The onChange event handler
     */
    onChange?: CheckboxOnChange;
}

export type CheckboxOnChange = (event?: React.ChangeEvent<HTMLElement>) => void;
