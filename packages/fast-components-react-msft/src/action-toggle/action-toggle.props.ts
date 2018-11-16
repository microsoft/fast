import * as React from "react";
import { Omit } from "utility-types";
import {
    ActionToggleClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import {
    ButtonAppearance,
    ButtonHandledProps,
    ButtonManagedClasses,
    ButtonUnhandledProps,
} from "../button/button.props";

export enum ActionToggleAppearance {
    justified = ButtonAppearance.justified,
    lightweight = ButtonAppearance.lightweight,
    outline = ButtonAppearance.outline,
    primary = ButtonAppearance.primary,
}

export interface ActionToggleManagedClasses
    extends ManagedClasses<ActionToggleClassNameContract> {}
export interface ActionToggleHandledProps
    extends Omit<ButtonHandledProps, "appearance" | keyof ButtonManagedClasses>,
        ActionToggleManagedClasses {
    /**
     * The action toggle appearance
     */
    appearance?: ActionToggleAppearance;

    /**
     * The action toggle selected glyph render prop
     */
    selectedGlyph: (className: string) => React.ReactNode;

    /**
     * The action toggle usselected glyph render prop
     */
    unselectedGlyph: (className: string) => React.ReactNode;

    /**
     * The action toggle selected text
     */
    selectedText?: string;

    /**
     * The action toggle unselected text
     */
    unselectedText?: string;

    /**
     * The onChange event handler
     */
    onChange?: (event: React.MouseEvent<HTMLElement>) => void;

    /**
     * The action toggle disabled property
     */
    disabled?: boolean;

    /**
     * The action toggle selected state
     */
    selected?: boolean;
}

/* tslint:disable-next-line:no-empty-interface */
export interface ActionToggleUnhandledProps extends ButtonUnhandledProps {}
export type ActionToggleProps = ActionToggleHandledProps & ActionToggleUnhandledProps;
