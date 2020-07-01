import React from "react";
import {
    Radio as BaseRadio,
    RadioHandledProps as BaseRadioHandledProps,
    RadioProps as BaseRadioProps,
    RadioClassNameContract,
    RadioManagedClasses,
    RadioSlot,
    RadioUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, RadioStyles } from "@microsoft/fast-components-styles-msft";
import radioSchema from "./radio.schema";
import radioSchema2 from "./radio.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Radio = manageJss(RadioStyles)(BaseRadio);
type Radio = InstanceType<typeof Radio>;

type RadioHandledProps = Subtract<BaseRadioHandledProps, RadioManagedClasses>;
type RadioProps = ManagedJSSProps<BaseRadioProps, RadioClassNameContract, DesignSystem>;

export {
    Radio,
    RadioClassNameContract,
    RadioHandledProps,
    RadioUnhandledProps,
    RadioProps,
    radioSchema,
    radioSchema2,
    RadioSlot,
};
