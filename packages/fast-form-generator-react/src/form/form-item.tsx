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

export enum mappingName {
    alignVertical = "alignVertical",
    alignHorizontal = "alignHorizontal",
    swatch = "swatch",
    customColor = "customColor",
    fileUpload = "fileUpload",
    theme = "theme",
    glyphPicker = "glyphPicker",
    textarea = "textarea",
}

export interface FormItemComponentMappingToProperyNamesProps extends FormItemCommon {
    /**
     * The type of layout to map to a layout component
     */
    name: mappingName;

    /**
     * The enums available for the property
     */
    options: string[] | undefined;
}
