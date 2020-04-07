import React from "react";
import { ChildOptionItem, Plugin, PluginProps } from "../../data-utilities";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface ViewerContentManagedClasses extends ManagedClasses<{}> {}
export interface ViewerContentUnhandledProps
    extends React.AllHTMLAttributes<HTMLElement> {}
export interface ViewerContentHandledProps extends ViewerContentManagedClasses {
    /**
     * The components available to the viewer content component for rendering
     */
    components: ChildOptionItem[];

    /**
     * The plugins available for manipulating the data mapping function
     */
    plugins?: Array<Plugin<PluginProps>>;
}

export type ViewerContentProps = ViewerContentUnhandledProps & ViewerContentHandledProps;
