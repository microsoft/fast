import { storiesOf } from "@storybook/react";
import React from "react";
import { ViewportContext } from "@microsoft/fast-components-react-base";
import { Heading, HeadingSize } from "../heading";
import { AccentButton } from "../accent-button";
import { FlyoutAxisPositioningMode } from "./flyout.props";
import {
    Flyout,
    FlyoutHorizontalPosition,
    FlyoutProps,
    FlyoutVerticalPosition,
} from "./";

interface FlyoutTestState {
    /**
     * Conditionally render the flyout
     */
    visible: boolean;
}

class FlyoutTest extends React.Component<Omit<FlyoutProps, "anchor">, FlyoutTestState> {
    private anchor: React.RefObject<any>;

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: FlyoutProps) {
        super(props);

        this.anchor = React.createRef();

        this.state = {
            visible: false,
        };
    }

    public componentDidMount(): void {
        this.rootElement.current.scrollTop = 100;
        this.rootElement.current.scrollLeft = 100;
    }

    public render(): JSX.Element {
        return (
            <ViewportContext.Provider
                value={{
                    viewport: this.rootElement,
                }}
            >
                <div
                    ref={this.rootElement}
                    style={{
                        margin: "20px 0",
                        position: "relative",
                        height: "400px",
                        width: "600px",
                        overflow: "scroll",
                        whiteSpace: "nowrap",
                    }}
                >
                    <div
                        style={{
                            height: "500px",
                            width: "800px",
                            background: "blue",
                        }}
                    >
                        <AccentButton
                            style={{
                                margin: "230px 0 0 380px",
                            }}
                            ref={this.anchor}
                            onClick={this.updateFlyoutState}
                        >
                            Flyout anchor
                        </AccentButton>
                        {this.renderFlyout()}
                    </div>
                </div>
            </ViewportContext.Provider>
        );
    }

    private renderFlyout(): JSX.Element {
        const { children, ...props }: Partial<FlyoutProps> = this.props;

        return (
            <Flyout anchor={this.anchor} visible={this.state.visible} {...props}>
                {children}
            </Flyout>
        );
    }

    private updateFlyoutState = (): void => {
        this.setState({
            visible: !this.state.visible,
        });
    };
}

storiesOf("Flyout", module)
    .add("Default", () => (
        <div>
            <Heading size={HeadingSize._4}>
                By default the flyout's only sets the vertical axis positioning mode to
                "adjacent" which places above or below the anchor based on available space
                (default placement is below the anchor).
            </Heading>
            <FlyoutTest>
                <Heading size={HeadingSize._5}>Flyout</Heading>
            </FlyoutTest>
        </div>
    ))
    .add("Flyout aligned vertically", () => (
        <div>
            <Heading size={HeadingSize._4}>
                Setting the horizonal axis positioning mode to "inset" aligns the flyout
                with the anchor horizontally as well as vertically
            </Heading>
            <FlyoutTest
                horizontalPositioningMode={FlyoutAxisPositioningMode.inset}
                verticalPositioningMode={FlyoutAxisPositioningMode.adjacent}
            >
                <Heading size={HeadingSize._5}>Flyout</Heading>
            </FlyoutTest>
        </div>
    ))
    .add("Flyout aligned horizontally", () => (
        <div>
            <Heading size={HeadingSize._4}>
                Setting the vertical axis positioning mode to "inset" and the horizontal
                mode to "adjacent" places the flyout beside the anchor
            </Heading>
            <FlyoutTest
                horizontalPositioningMode={FlyoutAxisPositioningMode.adjacent}
                verticalPositioningMode={FlyoutAxisPositioningMode.inset}
            >
                <Heading size={HeadingSize._5}>Flyout</Heading>
            </FlyoutTest>
        </div>
    ))
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
    ))
    .add("with Height", () => <FlyoutTest height={"100px"} />)
    .add("with Width", () => <FlyoutTest width={"200px"} />)
    .add("with Height and Width", () => <FlyoutTest height={"100px"} width={"200px"} />)
    .add("with horizontal always in view", () => (
        <FlyoutTest horizontalAlwaysInView={true} />
    ))
    .add("with vertical always in view", () => <FlyoutTest verticalAlwaysInView={true} />)
    .add("with soft dismiss", () => (
        <FlyoutTest onDismiss={(): void => alert("soft dismiss")} />
    ));
