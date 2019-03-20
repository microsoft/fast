export interface FormItemCommon<D> {
    /**
     * The form item label
     */
    label: string;

    /**
     * The location of the data using lodash path syntax
     * This is used as a unique ID for the form item
     */
    dataLocation: string;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The data values to be used for the form item
     */
    data: D;
}
