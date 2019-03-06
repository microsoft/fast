export default interface FormItemCommon {
    /**
     * The index to assign as a React key for mapping
     */
    index: number;

    /**
     * The location of the data
     */
    dataLocation: string;

    /**
     * The data
     */
    data: any;

    /**
     * Whether this item is required
     */
    required: boolean;

    /**
     * The label
     */
    label: string;

    /**
     * Whether this item is disabled
     */
    disabled?: boolean;

    /**
     * The passed onChange function
     */
    onChange: (
        dataLocation: string,
        value: any,
        isArray?: boolean,
        index?: number
    ) => void;

    /**
     * The defaut data (if available)
     */
    default?: any;
}

export interface CustomFormItemComponent extends FormItemCommon {
    /**
     * The enums available for the property
     */
    options: string[] | undefined;
}
