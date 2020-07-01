import React from "react";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TextActionStyles } from "@microsoft/fast-components-styles-msft";
import textActionSchema from "./text-action.schema";
import textActionSchema2 from "./text-action.schema.2";
import {
    TextActionHandledProps as MSFTTextActionHandledProps,
    TextActionProps as MSFTTextActionProps,
    TextActionAppearance,
    TextActionButtonPosition,
    TextActionManagedClasses,
    TextActionUnhandledProps,
} from "./text-action.props";
import MSFTTextAction from "./text-action";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const TextAction = manageJss(TextActionStyles)(MSFTTextAction);
type TextAction = InstanceType<typeof TextAction>;

type TextActionHandledProps = Subtract<
    MSFTTextActionHandledProps,
    TextActionManagedClasses
>;
type TextActionProps = ManagedJSSProps<
    MSFTTextActionProps,
    TextActionClassNameContract,
    DesignSystem
>;

export {
    TextAction,
    TextActionAppearance,
    TextActionButtonPosition,
    TextActionClassNameContract,
    TextActionHandledProps,
    TextActionManagedClasses,
    TextActionProps,
    TextActionUnhandledProps,
    textActionSchema,
    textActionSchema2,
};
