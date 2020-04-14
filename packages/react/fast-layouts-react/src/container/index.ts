import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { Subtract } from "utility-types";
import {
    Container as BaseContainer,
    ContainerHandledProps as BaseContainerHandledProps,
    ContainerProps as BaseContainerProps,
    ContainerClassNamesContract,
    ContainerManagedClasses,
    containerStyleSheet,
    ContainerUnhandledProps,
} from "./container";

const Container = manageJss(containerStyleSheet)(BaseContainer);
type Container = typeof Container;

type ContainerHandledProps = Subtract<BaseContainerHandledProps, ContainerManagedClasses>;
type ContainerProps = ManagedJSSProps<
    BaseContainerProps,
    ContainerClassNamesContract,
    undefined
>;

export {
    Container,
    ContainerProps,
    ContainerHandledProps,
    ContainerUnhandledProps,
    ContainerClassNamesContract,
};
