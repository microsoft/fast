import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
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

type ContainerHandledProps = Omit<
    BaseContainerHandledProps,
    keyof ContainerManagedClasses
>;
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
