import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * The class name contract for the footer component
 */
export interface FooterClassNameContract {
    /**
     * The root of the footer component
     */
    footer?: string;
}

/**
 * An interface for the footer managed classes
 */
export interface FooterManagedClasses extends ManagedClasses<FooterClassNameContract> {}

/**
 * An interface for the footer prop contract
 */
export interface FooterHandledProps extends FooterManagedClasses {
    /**
     * The footer children
     */
    children?: React.ReactNode;
}

/**
 * An interface for the footer unhnadled prop contract
 */
/* tslint:disable-next-line:no-empty-interface */
export interface FooterUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * An interface for the footer prop contract
 */
export type FooterProps = FooterHandledProps & FooterUnhandledProps;
