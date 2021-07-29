import { CommonControlConfig } from "../templates";

export interface FileControlState {
    value: string;
}

export interface FileControlProps extends CommonControlConfig {
    accept: string;
}
