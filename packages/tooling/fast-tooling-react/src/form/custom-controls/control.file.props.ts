import { CommonControlConfig } from "../templates";

export interface FileControlProps extends CommonControlConfig {
    /**
     * A comma seperated list of accepted file types.
     * Example: ".jpg,.png,.gif"
     */
    accept: string;
}
