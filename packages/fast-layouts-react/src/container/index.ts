import * as React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    Container as BaseContainer,
    ContainerClassNamesContract,
    ContainerHandledProps as BaseContainerHandledProps,
    ContainerManagedClasses,
    ContainerProps as BaseContainerProps,
    containerStyleSheet,
    ContainerUnhandledProps
} from "./container";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const Container = manageJss(containerStyleSheet)(BaseContainer);
type Container = typeof Container;

interface ContainerHandledProps extends Subtract<BaseContainerHandledProps, ContainerManagedClasses> {}
type ContainerProps = ManagedJSSProps<BaseContainerProps, ContainerClassNamesContract, undefined>;

export {
    Container,
    ContainerProps,
    ContainerHandledProps,
    ContainerUnhandledProps,
    ContainerClassNamesContract
};
