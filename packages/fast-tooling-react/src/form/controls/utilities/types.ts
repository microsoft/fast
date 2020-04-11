import { StandardControlPlugin } from "../../templates";
import { SingleLineControlPlugin } from "../../templates/plugin.control.single-line";

export interface Controls {
    /**
     * The button control
     */
    button: StandardControlPlugin;

    /**
     * The array control
     */
    array: StandardControlPlugin;

    /**
     * The linked data control
     */
    linkedData: StandardControlPlugin;

    /**
     * The checkbox control
     */
    checkbox: SingleLineControlPlugin;

    /**
     * The display control
     */
    display: StandardControlPlugin;

    /**
     * The textarea control
     */
    textarea: StandardControlPlugin;

    /**
     * The select control
     */
    select: StandardControlPlugin;

    /**
     * The section control
     */
    section: StandardControlPlugin;

    /**
     * The section link control
     */
    sectionLink: StandardControlPlugin;

    /**
     * The number field control
     */
    numberField: StandardControlPlugin;
}

export type AddExampleData = (
    propertyLocation: string,
    additionalSchemaPathSyntax?: string
) => void;
