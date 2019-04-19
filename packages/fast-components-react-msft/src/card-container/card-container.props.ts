import React from "react";
import {
    DesignSystem,
    DesignSystemResolver,
    NeutralPaletteDarkModeLayers,
    NeutralPaletteLightModeLayers,
} from "@microsoft/fast-components-styles-msft";
import { BackgroundHandledProps } from "../background/background.props";

export interface CardContainerHandledProps extends Pick<BackgroundHandledProps, "tag"> {}
export interface CardContainerUnhandledProps extends React.HTMLAttributes<HTMLElement> {}
export type CardContainerProps = CardContainerHandledProps & CardContainerUnhandledProps;
