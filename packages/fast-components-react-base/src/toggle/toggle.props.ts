import * as React from "react";

export interface IToggleProps {
    children?: React.ReactNode | React.ReactNode[];
    disabled: boolean;
    id: string;
    labelId: string
    selected: boolean;
    selectedString: string;
    spanId: string;
    unselectedString: string;
}
