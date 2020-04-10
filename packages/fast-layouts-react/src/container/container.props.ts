import React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ContainerClassNamesContract } from "./container";

export type ContainerManagedClasses = ManagedClasses<ContainerClassNamesContract>;
export type ContainerUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export type ContainerHandledProps = ContainerManagedClasses;
export type ContainerProps = ContainerHandledProps & ContainerUnhandledProps;
