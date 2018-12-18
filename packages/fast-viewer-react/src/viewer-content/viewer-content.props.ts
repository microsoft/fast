import React from "react";
import { ChildOptionItem } from "@microsoft/fast-data-utilities-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface ViewerContentManagedClasses extends ManagedClasses<{}> {}
export interface ViewerContentUnhandledProps
    extends React.AllHTMLAttributes<HTMLElement> {}
export interface ViewerContentHandledProps extends ViewerContentManagedClasses {
    /**
     * The components available to the viewer content component for rendering
     */
    components: ChildOptionItem[];
}

export type ViewerContentProps = ViewerContentUnhandledProps & ViewerContentHandledProps;
