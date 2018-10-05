import * as React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { IDesignSystem } from "../../design-system";

export interface IParagraphProps {
    text: string;
}

export interface ITestParagraphClassNameContract {
    paragraph: string;
}

const ParagraphStyles: ComponentStyles<ITestParagraphClassNameContract, IDesignSystem> = {
    paragraph: {
        textAlign: (config: IDesignSystem): string => {
            return config.ltr === "ltr" ? "left" : "right";
        }
    }
};

/* tslint:disable-next-line */
class Paragraph extends React.Component<IParagraphProps & IManagedClasses<ITestParagraphClassNameContract>, React.HTMLAttributes<HTMLButtonElement>, {}> {

    public render(): JSX.Element {
        return (
            <p className={this.props.managedClasses.paragraph}>
                {this.props.text}
            </p>
        );
    }
}

export default manageJss(ParagraphStyles)(Paragraph);
