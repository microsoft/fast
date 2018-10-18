import * as React from "react";
import {
    Radio as BaseRadio,
    RadioClassNameContract,
    RadioHandledProps as BaseRadioHandledProps,
    RadioManagedClasses,
    RadioProps as BaseRadioProps,
    RadioSlot,
    RadioUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, RadioStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Radio = manageJss(RadioStyles)(BaseRadio);
type Radio = typeof Radio;

interface RadioHandledProps
    extends Subtract<BaseRadioHandledProps, RadioManagedClasses> {}
type RadioProps = ManagedJSSProps<BaseRadioProps, RadioClassNameContract, DesignSystem>;

export {
    Radio,
    RadioClassNameContract,
    RadioHandledProps,
    RadioUnhandledProps,
    RadioProps,
    RadioSlot,
};
