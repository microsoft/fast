export enum BadgeType {
    warning = "warning",
    info = "info",
    locked = "locked",
}

export enum ArrayAction {
    add = "add",
    remove = "remove",
}

export interface CommonFormControlProps {
    /**
     * The index to assign as a React key for mapping
     */
    index: number;

    /**
     * The location of the data
     */
    dataLocation: string;

    /**
     * The schema
     */
    schema: any;

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

    /**
     * The badge to use next to a form items label
     */
    badge?: BadgeType;

    /**
     * The badge description which is used as an HTML title
     */
    badgeDescription?: string;

    /**
     * The validation message if the form item is invalid
     */
    invalidMessage: string;

    /**
     * Display the validation inline
     */
    displayValidationInline?: boolean;

    /**
     * Display the validation as browser default tooltips
     */
    displayValidationBrowserDefault?: boolean;

    /**
     * Enable soft remove
     * defaults to true
     */
    softRemove?: boolean;
}

export interface CustomFormControlProps extends CommonFormControlProps {
    /**
     * The enums available for the property
     */
    options: string[] | undefined;
}
