import * as React from "react";
import {
    Card as BaseCard,
    CardClassNameContract,
    CardHandledProps as BaseCardHandledProps,
    CardManagedClasses,
    CardProps as BaseCardProps,
    CardTag,
    CardUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CardStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*tslint:disable-next-line:typedef */
const Card = manageJss(CardStyles)(BaseCard);
type Card = typeof Card;

interface CardHandledProps extends Subtract<BaseCardHandledProps, CardManagedClasses> {}
type CardProps = ManagedJSSProps<BaseCardProps, CardClassNameContract, DesignSystem>;

export {
    Card,
    CardProps,
    CardTag,
    CardClassNameContract,
    CardHandledProps,
    CardUnhandledProps
};
