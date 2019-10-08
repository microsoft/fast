import { ArrayControlConfig, DragState } from "../templates";

export enum ItemConstraints {
    minItems = "minItems",
    maxItems = "maxItems",
}

/* tslint:disable-next-line */
export interface ArrayControlProps extends ArrayControlConfig {}

/* tslint:disable-next-line */
export interface ArrayControlState extends DragState {}
