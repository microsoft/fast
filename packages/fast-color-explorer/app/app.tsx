import {
    DesignSystem,
    neutralLayerL1,
    neutralLayerL1Alt,
    neutralLayerL2,
    neutralLayerL3,
    neutralLayerL4,
    palette,
    PaletteType,
} from "@microsoft/fast-components-styles-msft";
import React from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { ColorsDesignSystem } from "./design-system";
import { Gradient } from "./gradient";
import ColorBlocks from "./color-blocks";
import { ControlPane } from "./control-pane";
import { Canvas, Container, Row } from "@microsoft/fast-layouts-react";
import { AppState } from "./state";
import { connect } from "react-redux";
import {
    Background,
    DarkModeBackgrounds,
    LightModeBackgrounds,
} from "@microsoft/fast-components-react-msft";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
    ColorRecipe,
    Swatch,
} from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";

interface AppProps {
    designSystem: ColorsDesignSystem;
    neutralBaseColor: Swatch;
    accentBaseColor: Swatch;
    showOnlyRecommendedBackgrounds: boolean;
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

    private backgroundRecipes: Array<ColorRecipe<string>> = [
        neutralLayerL1,
        neutralLayerL1Alt,
        neutralLayerL2,
        neutralLayerL3,
        neutralLayerL4,
    ];

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
        const backgrounds: string[] = this.backgrounds();

        return (
            <FixedSizeList
                width={props.width}
                height={props.height}
                itemSize={400}
                layout={"horizontal"}
                itemCount={
                    backgrounds.length
                }
                itemKey={(index: number): string => backgrounds[index]}
                ref={this.colorBlockScrollerRef}
                itemData={backgrounds}
            >
                {this.renderColorBlock}
            </FixedSizeList>
        );
    };

    private renderColorBlock = (props: any): JSX.Element => {
        const color: string = props.data[props.index];
        const index: number = this.props.designSystem.neutralPalette.indexOf(color);

        return (
            <div style={props.style} key={color}>
                <Background value={color} style={{ minHeight: "100%" }}>
                    <ColorBlocks {...({ backgroundColor: color, index } as any)} />
                </Background>
            </div>
        );
    };

    private backgrounds(): string[] {
        return this.props.showOnlyRecommendedBackgrounds
            ? this.backgroundRecipes
                  .map(this.applyLightMode)
                  .concat(this.backgroundRecipes.map(this.applyDarkMode))
                  .reduce(
                      (accum: string[], value: string): string[] =>
                          accum.includes(value) ? accum : accum.concat(value),
                      []
                  )
            : this.props.designSystem.neutralPalette;
    }

    private applyLightMode = (recipe: ColorRecipe<string>): string => {
        return recipe((): string => this.props.designSystem.neutralPalette[0])(
            this.props.designSystem
        );
    };

    private applyDarkMode = (recipe: ColorRecipe<string>): string => {
        return recipe(
            (): string =>
                this.props.designSystem.neutralPalette[
                    this.props.designSystem.neutralPalette.length - 1
                ]
        )(this.props.designSystem);
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
