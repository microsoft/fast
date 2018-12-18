import React from "react";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { DesignSystem } from "../../design-system";

export interface ParagraphProps {
    text: string;
}

export interface TestParagraphClassNameContract {
    paragraph: string;
}

export const ParagraphStyles: ComponentStyles<
    TestParagraphClassNameContract,
    DesignSystem
> = {
    paragraph: {
        textAlign: (config: DesignSystem): string => {
            return config.ltr === "ltr" ? "left" : "right";
        },
        color: "#666666",
    },
};

/* tslint:disable-next-line */
class Paragraph extends React.Component<
    ParagraphProps & ManagedClasses<TestParagraphClassNameContract>,
    React.HTMLAttributes<HTMLButtonElement>,
    {}
> {
    public render(): JSX.Element {
        return <p className={this.props.managedClasses.paragraph}>{this.props.text}</p>;
    }
}
export default Paragraph;
