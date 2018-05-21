import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IContainerClassNamesContract } from "./container";

export type ContainerProps = IManagedClasses<IContainerClassNamesContract> & React.HTMLAttributes<HTMLDivElement>;
