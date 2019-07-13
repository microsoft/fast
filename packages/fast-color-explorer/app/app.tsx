import React from "react";
import { Canvas, Container, Row } from "@microsoft/fast-layouts-react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { ColorsDesignSystem } from "./design-system";
import { Gradient } from "./gradient";
import ColorBlocks from "./color-blocks";
import { ControlPane } from "./control-pane";
import { palette, PaletteType } from "@microsoft/fast-components-styles-msft";
import { AppState } from "./state";
import { connect } from "react-redux";
import {
    Background,
    DarkModeBackgrounds,
    LightModeBackgrounds,
} from "@microsoft/fast-components-react-msft";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Swatch } from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";

interface AppProps {
    designSystem: ColorsDesignSystem;
    neutralBaseColor: Swatch;
    accentBaseColor: Swatch;
    showOnlyRecommendedBackgrounds: boolean;
}

/**
 * Array of indexes corresponding to the recommended background colors
 */
const reccomendedBackgrounds: any[] = Object.keys(DarkModeBackgrounds)
    .concat(Object.keys(LightModeBackgrounds))
    .map((key: string) => parseInt(key, 10))
    .filter((index: number) => !isNaN(index))
    .sort((a: number, b: number): number => {
        return a > b ? 1 : a < b ? -1 : 1
    });

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
                                <Row height={20} minHeight={20}>
                                    <Gradient
                                        colors={palette(PaletteType.neutral)(
                                            this.props.designSystem
                                        )}
                                        markedColor={this.props.neutralBaseColor}
                                        createAnchors={true}
                                        scrollToItem={this.handleGradientScroll}
                                    />
                                </Row>
                                <Row height={20} minHeight={20}>
                                    <Gradient
                                        colors={palette(PaletteType.accent)(
                                            this.props.designSystem
                                        )}
                                        markedColor={this.props.accentBaseColor}
                                        createAnchors={false}
                                    />
                                </Row>
                                <Row fill={true}>
                                    <AutoSizer
                                        onResize={
                                            /* this lambda is intentional - it forces the pure component to re-render */ (): void => {}
                                        }
                                    >
                                        {this.renderColorBlockList}
                                    </AutoSizer>
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
                itemCount={
                    this.props.showOnlyRecommendedBackgrounds
                        ? reccomendedBackgrounds.length
                        : this.props.designSystem.neutralPalette.length
                }
                itemKey={(index: number): string =>
                    palette(PaletteType.neutral)(this.props.designSystem)[
                        this.props.showOnlyRecommendedBackgrounds
                            ? reccomendedBackgrounds[index]
                            : index
                    ]
                }
                ref={this.colorBlockScrollerRef}
            >
                {this.renderColorBlock}
            </FixedSizeList>
        );
    };

    private renderColorBlock = (props: any): JSX.Element => {
        const index: number = this.props.showOnlyRecommendedBackgrounds
            ? reccomendedBackgrounds[props.index]
            : props.index
        const color: string = palette(PaletteType.neutral)(this.props.designSystem)[
            index
        ];

        return (
            <div style={props.style} key={color}>
                <Background value={color} style={{ minHeight: "100%" }}>
                    <ColorBlocks
                        {...({ backgroundColor: color, index } as any)}
                    />
                </Background>
            </div>
        );
    };
}

function mapStateToProps(state: AppState): Partial<AppProps> {
    return {
        designSystem: state.designSystem,
        neutralBaseColor: state.neutralBaseColor,
        accentBaseColor: state.accentBaseColor,
        showOnlyRecommendedBackgrounds: state.showOnlyRecommendedBackgrounds,
    };
}

export default connect(mapStateToProps)(App);
