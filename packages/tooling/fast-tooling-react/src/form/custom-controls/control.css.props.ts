import { ControlConfig } from "../templates";

export type CSSControlProps = ControlConfig;

export interface CSSControlState {
    /**
     * Each key represents a property name and the string as the property value
     */
    [key: string]: string;
}
