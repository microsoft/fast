import React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ContainerClassNamesContract } from "./container";

export interface ContainerManagedClasses
    extends ManagedClasses<ContainerClassNamesContract> {}
export interface ContainerUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
/* tslint:disable-next-line:no-empty-interface */
export interface ContainerHandledProps extends ContainerManagedClasses {}
export type ContainerProps = ContainerHandledProps & ContainerUnhandledProps;
