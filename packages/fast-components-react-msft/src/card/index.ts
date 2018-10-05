import * as React from "react";
import {
    Card as BaseCard,
    CardProps as BaseCardProps,
    CardTag,
    ICardClassNameContract,
    ICardHandledProps as IBaseCardHandledProps,
    ICardManagedClasses,
    ICardUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CardStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*tslint:disable-next-line:typedef */
const Card = manageJss(CardStyles)(BaseCard);
type Card = typeof Card;

interface ICardHandledProps extends Subtract<IBaseCardHandledProps, ICardManagedClasses> {}
type CardProps = ManagedJSSProps<BaseCardProps, ICardClassNameContract, IDesignSystem>;

export {
    Card,
    CardProps,
    CardTag,
    ICardClassNameContract,
    ICardHandledProps,
    ICardUnhandledProps
};
