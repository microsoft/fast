import * as React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { DesignSystem } from "../../design-system";

export interface ButtonProps {
    text: string;
    object: any;
}

export interface TestButtonClassNameContract {
    button: string;
}

const ButtonStyles: ComponentStyles<TestButtonClassNameContract, DesignSystem> = {
    button: {
        width: "50px",
        textAlign: (config: DesignSystem): string => {
            return config.ltr === "ltr" ? "left" : "right";
        }
    }
};

/* tslint:disable-next-line */
class Button extends React.Component<
    ButtonProps & ManagedClasses<TestButtonClassNameContract>,
    React.HTMLAttributes<HTMLButtonElement>,
    {}
> {
    public render(): JSX.Element {
        return (
            <button className={this.props.managedClasses.button}>
                {this.props.children}
            </button>
        );
    }
}

export default manageJss(ButtonStyles)(Button);
