import * as React from "react";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { IDesignSystem } from "../../design-system";

export interface IButtonProps {
    text: string;
    object: any;
}

export interface ITestButtonClassNameContract {
    button: string;
}

const ButtonStyles: ComponentStyles<ITestButtonClassNameContract, IDesignSystem> = {
    button: {
        width: "50px",
        textAlign: (config: IDesignSystem): string => {
            return config.ltr === "ltr" ? "left" : "right";
        }
    }
};

/* tslint:disable-next-line */
class Button extends React.Component<IButtonProps & IManagedClasses<ITestButtonClassNameContract>, React.HTMLAttributes<HTMLButtonElement>, {}> {

    public render(): JSX.Element {
        return (
            <button className={this.props.managedClasses.button}>
                {this.props.text}
                {this.props.children}
            </button>
        );
    }
}

export default manageJss(ButtonStyles)(Button);
