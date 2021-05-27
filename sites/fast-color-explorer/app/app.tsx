import { StandardLuminance } from "@microsoft/fast-components";
import { Background } from "@microsoft/fast-components-react-msft";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { Canvas, Container, Row } from "@microsoft/fast-layouts-react";
import React from "react";
import { connect } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import ColorBlocks from "./color-blocks";
import { ControlPane } from "./control-pane";
import { ColorsDesignSystem } from "./design-system";
import { Gradient } from "./gradient";
import {
    ColorRecipe,
    neutralLayer1,
    neutralLayer2,
    neutralLayer3,
    neutralLayer4,
    neutralLayerCardContainer,
    neutralLayerFloating,
    Swatch,
    SwatchResolver,
} from "./recipes";
import { Footer } from "./site-footer";
import { AppState, ComponentTypes } from "./state";

interface AppProps {
    designSystem: ColorsDesignSystem;
    componentType: ComponentTypes;
    neutralBaseColor: Swatch;
    accentBaseColor: Swatch;
    showOnlyRecommendedBackgrounds: boolean;
}

class App extends React.Component<AppProps, {}> {
    private colorBlockScrollerRef: React.RefObject<FixedSizeList> = React.createRef<
        FixedSizeList
    >();

    private containerStyleOverrides: any = {
        container: {
            width: "100%",
            minHeight: "100%",
        },
    };

    private backgroundRecipes: Array<[SwatchResolver, string]> = [
        [neutralLayerFloating, "neutralLayerFloating"],
        [neutralLayerCardContainer, "neutralLayerCardContainer"],
        [neutralLayer1, "neutralLayer1"],
        [neutralLayer2, "neutralLayer2"],
        [neutralLayer3, "neutralLayer3"],
        [neutralLayer4, "neutralLayer4"],
    ];

    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={this.props.designSystem}>
                <Container jssStyleSheet={this.containerStyleOverrides}>
                    <Row fill={true}>
                        <Canvas>
                            <Container jssStyleSheet={this.containerStyleOverrides}>
                                <Row height={20} minHeight={20}>
                                    <Gradient
                                        colors={this.props.designSystem.neutralPalette}
                                        markedColor={this.props.neutralBaseColor}
                                        createAnchors={true}
                                        scrollToItem={this.handleGradientScroll}
                                    />
                                </Row>
                                <Row height={20} minHeight={20}>
                                    <Gradient
                                        colors={this.props.designSystem.accentPalette}
                                        markedColor={this.props.accentBaseColor}
                                        createAnchors={false}
                                    />
                                </Row>
                                <Row fill={true}>{this.renderContents()}</Row>
                            </Container>
                        </Canvas>
                        <ControlPane />
                    </Row>
                </Container>
                <Footer />
            </DesignSystemProvider>
        );
    }

    private handleGradientScroll = (index: number, align: string): void => {
        if (this.colorBlockScrollerRef.current !== null) {
            this.colorBlockScrollerRef.current.scrollToItem(index, align);
        }
    };

    private renderContents = (): React.ReactNode => {
        if (this.props.componentType === ComponentTypes.sample) {
            return (
                <div style={{ display: "flex", overflow: "auto" }}>
                    {this.renderSampleApp()}
                </div>
            );
        } else {
            return (
                <AutoSizer
                    onResize={
                        /* eslint-disable-next-line */
                        /* this lambda is intentional - it forces the pure component to re-render */ (): void => {}
                    }
                >
                    {this.renderColorBlockList}
                </AutoSizer>
            );
        }
    };

    private renderSampleApp = (): React.ReactNode => {
        return (
            <app-palette-wrapper
                neutral-base-color={this.props.neutralBaseColor}
                accent-base-color={this.props.accentBaseColor}
                style={{
                    display: "flex",
                    alignItems: "stretch",
                    alignContent: "stretch",
                    justifyContent: "center",
                }}
            >
                <app-layer-background
                    base-layer-luminance={StandardLuminance.LightMode}
                    background-layer-recipe="L4"
                    style={{ flexGrow: "1", padding: "100px" }}
                >
                    <app-sample-app></app-sample-app>
                </app-layer-background>
                <app-layer-background
                    background-layer-recipe="L4"
                    style={{ flexGrow: "1", padding: "100px" }}
                >
                    <app-sample-app></app-sample-app>
                </app-layer-background>
            </app-palette-wrapper>
        );
    };

    private renderColorBlockList = (props: any): JSX.Element => {
        const backgrounds: Array<{ color: string; title?: string }> = this.backgrounds();

        return (
            <FixedSizeList
                width={props.width}
                height={props.height}
                itemSize={400}
                layout={"horizontal"}
                itemCount={backgrounds.length}
                itemKey={(index: number): string => backgrounds[index].color}
                ref={this.colorBlockScrollerRef}
                itemData={backgrounds}
            >
                {this.renderColorBlock}
            </FixedSizeList>
        );
    };

    private renderColorBlock = (props: any): JSX.Element => {
        const color: string = props.data[props.index].color;
        const index: number = this.props.designSystem.neutralPalette.indexOf(color);

        return (
            <div style={props.style} key={color}>
                <Background value={color} style={{ minHeight: "100%" }}>
                    <ColorBlocks
                        index={index}
                        backgroundColor={color}
                        title={props.data[props.index].title}
                    />
                </Background>
            </div>
        );
    };

    private backgrounds(): Array<{ color: string; title?: string }> {
        const neutralPalette: string[] = this.props.designSystem.neutralPalette;
        const neutralLayers: Array<{
            color: string;
            title: string;
        }> = this.lightModeLayers.concat(this.darkModeLayers);

        return this.props.showOnlyRecommendedBackgrounds
            ? neutralLayers
            : neutralPalette.map((color: string): { color: string; title?: string } => {
                  const neutralLayerIndex: number = neutralLayers.findIndex(
                      (config: { color: string; title: string }): boolean =>
                          config.color === color
                  );

                  return {
                      color,
                      title:
                          neutralLayerIndex !== -1
                              ? neutralLayers[neutralLayerIndex].title
                              : undefined,
                  };
              });
    }

    private resolveRecipes = (
        luminance: number
    ): Array<{ color: string; title: string }> => {
        const designSystem: ColorsDesignSystem = Object.assign(
            {},
            this.props.designSystem,
            {
                baseLayerLuminance: luminance,
            }
        );
        return this.backgroundRecipes
            .map((conf: [ColorRecipe<string>, string]): {
                color: string;
                title: string;
            } => ({
                color: conf[0](designSystem),
                title: conf[1],
            }))
            .reduce(
                (
                    accum: Array<{ color: string; title: string }>,
                    value: { color: string; title: string }
                ): Array<{ color: string; title: string }> => {
                    const colorIndex: number = accum.findIndex(
                        (config: { color: string; title: string }): boolean =>
                            config.color === value.color
                    );

                    return colorIndex === -1
                        ? accum.concat(value)
                        : accum.map(
                              (
                                  config: { color: string; title: string },
                                  index: number
                              ): { color: string; title: string } =>
                                  index === colorIndex
                                      ? {
                                            color: value.color,
                                            title: value.title.concat(", ", config.title),
                                        }
                                      : config
                          );
                },
                []
            );
    };

    private get lightModeLayers(): Array<{ color: string; title: string }> {
        return this.resolveRecipes(StandardLuminance.LightMode);
    }

    private get darkModeLayers(): Array<{ color: string; title: string }> {
        return this.resolveRecipes(StandardLuminance.DarkMode);
    }
}

function mapStateToProps(state: AppState): Partial<AppProps> {
    return {
        designSystem: state.designSystem,
        componentType: state.componentType,
        neutralBaseColor: state.neutralBaseColor,
        accentBaseColor: state.accentBaseColor,
        showOnlyRecommendedBackgrounds: state.showOnlyRecommendedBackgrounds,
    };
}

export default connect(mapStateToProps)(App);
