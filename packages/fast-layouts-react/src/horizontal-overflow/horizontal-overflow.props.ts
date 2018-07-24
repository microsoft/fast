import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IHorizontalOverflowClassNamesContract } from "./horizontal-overflow";

export interface IHorizontalOverflowProps {
    scrollDuration?: number;
}

export type HorizontalOverflowProps = IHorizontalOverflowProps
    & IManagedClasses<IHorizontalOverflowClassNamesContract>
    & React.HTMLAttributes<HTMLDivElement>;
