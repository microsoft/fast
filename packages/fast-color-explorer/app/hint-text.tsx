import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import classnames from "classnames";
import { neutralForegroundHint } from "@microsoft/fast-components-styles-msft";

interface HintTextManagedClasses {
    managedClasses: {
        neutralForegroundHint: string;
        neutralForegroundHint__disabled: string;
    };
}

const styles: any = {
    neutralForegroundHint: {
        color: neutralForegroundHint,
    },
    neutralForegroundHint__disabled: {
        opacity: 0.3,
    },
};

interface HintTextProps extends HintTextManagedClasses {
    children: React.ReactNode;
    disabled?: boolean;
}

/* tslint:disable-next-line */
const HintText = manageJss(styles)(
    (props: HintTextProps): JSX.Element => {
        const classNames: string = classnames(
            props.managedClasses.neutralForegroundHint,
            {
                [props.managedClasses.neutralForegroundHint__disabled]: props.disabled,
            }
        );

        return <p className={classNames}>{props.children}</p>;
    }
);

type HintText = InstanceType<typeof HintText>;
export { HintText };
