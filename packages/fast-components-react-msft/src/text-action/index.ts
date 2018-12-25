import MSFTTextAction from "./text-action";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    TextActionButtonPosition,
    TextActionHandledProps as MSFTTextActionHandledProps,
    TextActionManagedClasses,
    TextActionProps as MSFTTextActionProps,
    TextActionUnhandledProps,
} from "./text-action.props";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TextActionStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const TextAction = manageJss(TextActionStyles)(MSFTTextAction);
type TextAction = InstanceType<typeof TextAction>;

interface TextActionHandledProps
    extends Subtract<MSFTTextActionHandledProps, TextActionManagedClasses> {}
type TextActionProps = ManagedJSSProps<
    MSFTTextActionProps,
    TextActionClassNameContract,
    DesignSystem
>;

export {
    TextAction,
    TextActionButtonPosition,
    TextActionHandledProps,
    TextActionManagedClasses,
    TextActionProps,
    TextActionUnhandledProps,
};
