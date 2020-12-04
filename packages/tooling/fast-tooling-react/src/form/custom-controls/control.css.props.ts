import { ControlConfig } from "../templates";

export type CSSControlProps = ControlConfig;

export interface PropertyState {
    /**
     * The chosen index of the property syntax
     */
    index: number;

    /**
     * The property name this maps to
     */
    mapsToProperty: string;

    /**
     * The values selected via input
     */
    values: string[];
}

export interface CSSControlState {
    [key: string]: PropertyState;
}
