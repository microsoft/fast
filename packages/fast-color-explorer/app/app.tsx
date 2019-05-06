import React from "react";
import { Canvas, Container, Pane, Row } from "@microsoft/fast-layouts-react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { ColorsDesignSystem } from "./design-system";
import { Gradient } from "./gradient";
import ColorBlocks from "./color-blocks";
import { ControlPane } from "./control-pane";
import { palette, PaletteType } from "@microsoft/fast-components-styles-msft";
import { AppState } from "./state";
import { connect } from "react-redux";
import { Background, DarkModeBackgrounds } from "@microsoft/fast-components-react-msft";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface AppProps {
    designSystem: ColorsDesignSystem;
}
/* tslint:disable:jsx-no-lambda */
/* tslint:disable:no-empty */
class App extends React.Component<AppProps, {}> {
    private colorBlockScrollerRef: React.RefObject<FixedSizeList> = React.createRef<
        FixedSizeList
    >();

    private containerStyleOverrides: any = {
        container: {
            width: "100%",
            height: "100%",
        },
    };

    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={this.props.designSystem}>
                <Container>
                    <Row fill={true}>
                        <Canvas>
                            <Container jssStyleSheet={this.containerStyleOverrides}>
                                <Row fill={true}>
                                    <AutoSizer
                                        onResize={
                                            /* this lambda is intentional - it forces the pure component to re-render */ (): void => {}
                                        }
                                    >
                                        {this.renderColorBlockList}
                                    </AutoSizer>
                                </Row>
                                <Row>
                                    <Gradient
                                        colors={palette(PaletteType.neutral)(
                                            this.props.designSystem
                                        )}
                                        createAnchors={true}
                                        scrollToItem={this.handleGradientScroll}
                                    />
                                </Row>
                                <Row>
                                    <Gradient
                                        colors={palette(PaletteType.accent)(
                                            this.props.designSystem
                                        )}
                                        createAnchors={false}
                                    />
                                </Row>
                            </Container>
                        </Canvas>
                        <Background value={DarkModeBackgrounds.L4}>
                            <ControlPane />
                        </Background>
                    </Row>
                </Container>
            </DesignSystemProvider>
        );
    }

    private handleGradientScroll = (index: number, align: string): void => {
        if (this.colorBlockScrollerRef.current !== null) {
            this.colorBlockScrollerRef.current.scrollToItem(index, align);
        }
    };

    private renderColorBlockList = (props: any): JSX.Element => {
        return (
            <FixedSizeList
                width={props.width}
                height={props.height}
                itemSize={400}
                layout={"horizontal"}
                itemCount={this.props.designSystem.neutralPalette.length}
                itemKey={(index: number): string =>
                    palette(PaletteType.neutral)(this.props.designSystem)[index]
                }
                ref={this.colorBlockScrollerRef}
            >
                {this.renderColorBlock}
            </FixedSizeList>
        );
    };

    private renderColorBlock = (props: any): JSX.Element => {
        const color: string = palette(PaletteType.neutral)(this.props.designSystem)[
            props.index
        ];

        return (
            <div style={props.style} key={color}>
                <ColorBlocks {...{ backgroundColor: color, index: props.index } as any} />
            </div>
        );
    };
}

function mapStateToProps(state: AppState): Partial<AppProps> {
    return {
        designSystem: state.designSystem,
    };
}

export default connect(mapStateToProps)(App);
