import Foundation from "@microsoft/fast-components-foundation-react";
import { neutralFillCardRest } from "@microsoft/fast-components-styles-msft";
import React from "react";
import { Background } from "../background";
import {
    CardContainerHandledProps,
    CardContainerProps,
    CardContainerUnhandledProps,
} from "./card-container.props";

export default class CardContainer extends Foundation<
    CardContainerHandledProps,
    CardContainerUnhandledProps,
    {}
> {
    public static defaultProps: Partial<CardContainerProps> = {
        tag: "div",
    };

    public render(): JSX.Element {
        return (
            <Background
                {...this.unhandledProps()}
                tag={this.props.tag}
                value={neutralFillCardRest}
                drawBackground={false}
                children={this.props.children}
            />
        );
    }
}

export * from "./card-container.props";
