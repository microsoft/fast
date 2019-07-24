import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { action } from "@storybook/addon-actions";
import {
    Flyout,
    FlyoutHorizontalPosition,
    FlyoutProps,
    FlyoutVerticalPosition,
} from "./";
import { FlyoutAxisPositioningMode } from "./flyout.props";
import { Heading, HeadingSize } from "../heading";
import { Paragraph, ParagraphSize } from "../paragraph";
import { AccentButton } from "../accent-button";
import { Omit } from "utility-types";

interface FlyoutTestState {
    /**
     * Conditionally render the flyout
     */
    visible: boolean;
}

class FlyoutTest extends React.Component<Omit<FlyoutProps, "anchor">, FlyoutTestState> {
    private anchor: React.RefObject<any>;

    constructor(props: FlyoutProps) {
        super(props);

        this.anchor = React.createRef();
        this.state = {
            visible: false,
        };
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                <AccentButton
                    ref={this.anchor}
                    onClick={this.updateFlyoutState}
                    style={{ margin: "0 auto" }}
                >
                    Flyout anchor
                </AccentButton>
                {this.renderFlyout()}
            </React.Fragment>
        );
    }

    private renderFlyout(): JSX.Element {
        if (!this.state.visible) {
            return;
        }

        const { children, visible, ...props }: Partial<FlyoutProps> = this.props;
        const anchor: HTMLElement = ReactDOM.findDOMNode(this.anchor.current);

        return (
            <Flyout anchor={anchor} visible={this.state.visible} {...props}>
                {children}
            </Flyout>
        );
    }

    private updateFlyoutState = (e: React.MouseEvent<any>): void => {
        this.setState({
            visible: !this.state.visible,
        });
    };
}

storiesOf("Flyout", module)
    .add("Default", () => <FlyoutTest />)
    .add("with Children", () => (
        <FlyoutTest>
            <Heading size={HeadingSize._5}>Flyout</Heading>
            <Paragraph size={ParagraphSize._3}>This is a flyout component.</Paragraph>
            <AccentButton>Accept</AccentButton>
        </FlyoutTest>
    ))
    .add("with soft dismiss", () => (
        /* tslint:disable-next-line:jsx-no-lambda */
        <FlyoutTest onDismiss={(): void => alert("soft dismiss")} />
    ))
    .add("with Height", () => <FlyoutTest height={"100px"} />)
    .add("with Width", () => <FlyoutTest width={"200px"} />)
    .add("with Height and Width", () => <FlyoutTest height={"100px"} width={"200px"} />)
    .add("with horizontal always in view", () => (
        <FlyoutTest horizontalAlwaysInView={true} />
    ))
    .add("with vertical always in view", () => <FlyoutTest verticalAlwaysInView={true} />)
    .add("with bottom/left adjacent", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.adjacent}
            defaultHorizontalPosition={FlyoutHorizontalPosition.left}
            defaultVerticalPosition={FlyoutVerticalPosition.bottom}
            horizontalLockToDefault={true}
            verticalLockToDefault={true}
        />
    ))
    .add("with top/left adjacent", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.adjacent}
            defaultHorizontalPosition={FlyoutHorizontalPosition.left}
            defaultVerticalPosition={FlyoutVerticalPosition.top}
            horizontalLockToDefault={true}
            verticalLockToDefault={true}
        />
    ))
    .add("with bottom/right adjacent", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.adjacent}
            defaultHorizontalPosition={FlyoutHorizontalPosition.right}
            defaultVerticalPosition={FlyoutVerticalPosition.bottom}
            horizontalLockToDefault={true}
            verticalLockToDefault={true}
        />
    ))
    .add("with top/right adjacent", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.adjacent}
            defaultHorizontalPosition={FlyoutHorizontalPosition.right}
            defaultVerticalPosition={FlyoutVerticalPosition.top}
            horizontalLockToDefault={true}
            verticalLockToDefault={true}
        />
    ))
    .add("with bottom/left uncontrolled", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.uncontrolled}
            defaultHorizontalPosition={FlyoutHorizontalPosition.left}
            defaultVerticalPosition={FlyoutVerticalPosition.bottom}
            horizontalLockToDefault={true}
            verticalLockToDefault={true}
        />
    ))
    .add("with top/left uncontrolled", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.uncontrolled}
            defaultHorizontalPosition={FlyoutHorizontalPosition.left}
            defaultVerticalPosition={FlyoutVerticalPosition.top}
        />
    ))
    .add("with bottom/right uncontrolled", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.uncontrolled}
            defaultHorizontalPosition={FlyoutHorizontalPosition.right}
            defaultVerticalPosition={FlyoutVerticalPosition.bottom}
        />
    ))
    .add("with top/right uncontrolled", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.uncontrolled}
            defaultHorizontalPosition={FlyoutHorizontalPosition.right}
            defaultVerticalPosition={FlyoutVerticalPosition.top}
        />
    ))
    .add("with bottom/left inset", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.inset}
            defaultHorizontalPosition={FlyoutHorizontalPosition.left}
            defaultVerticalPosition={FlyoutVerticalPosition.bottom}
        />
    ))
    .add("with top/left inset", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.inset}
            defaultHorizontalPosition={FlyoutHorizontalPosition.left}
            defaultVerticalPosition={FlyoutVerticalPosition.top}
        />
    ))
    .add("with bottom/right inset", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.inset}
            defaultHorizontalPosition={FlyoutHorizontalPosition.right}
            defaultVerticalPosition={FlyoutVerticalPosition.bottom}
        />
    ))
    .add("with top/right inset", () => (
        <FlyoutTest
            horizontalPositioningMode={FlyoutAxisPositioningMode.inset}
            defaultHorizontalPosition={FlyoutHorizontalPosition.right}
            defaultVerticalPosition={FlyoutVerticalPosition.top}
        />
    ));
