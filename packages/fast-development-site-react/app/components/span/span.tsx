import React from "react";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { DesignSystem } from "../../design-system";

export interface SpanProps {
    text: string;
}

export interface TestSpanClassNameContract {
    span: string;
}

export const SpanStyles: ComponentStyles<TestSpanClassNameContract, DesignSystem> = {
    span: {
        textAlign: (config: DesignSystem): string => {
            return config.ltr === "ltr" ? "left" : "right";
        },
        color: "#666666",
    },
};

/* tslint:disable-next-line */
class Span extends React.Component<
    SpanProps & ManagedClasses<TestSpanClassNameContract>,
    React.HTMLAttributes<HTMLSpanElement>,
    {}
> {
    public render(): JSX.Element {
        return <span className={this.props.managedClasses.span}>{this.props.text}</span>;
    }
}
export default Span;
