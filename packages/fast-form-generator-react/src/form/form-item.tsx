export default interface IFormItemCommon {

    /**
     * The unique key for React components
     */
    key: string | number;

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
     * The passed onChange function
     */
    onChange: (dataLocation: string, value: any, isArray?: boolean, index?: number) => void;

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
    textarea = "textarea"
}

export interface IFormItemComponentMappingToProperyNamesProps extends IFormItemCommon {
    /**
     * The type of layout to map to a layout component
     */
    name: mappingName;

    /**
     * The enums available for the property
     */
    options: string[] | undefined;
}
