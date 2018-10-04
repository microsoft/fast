import * as React from "react";
import {
    Card as BaseCard,
    ICardClassNameContract,
    ICardHandledProps,
    ICardUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { CardStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

/*tslint:disable-next-line:typedef */
const Card = manageJss(CardStyles)(BaseCard);
type Card = InstanceType<typeof Card>;

export { Card };
