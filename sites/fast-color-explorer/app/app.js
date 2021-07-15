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
import { Gradient } from "./gradient";
import {
    neutralLayer1,
    neutralLayer2,
    neutralLayer3,
    neutralLayer4,
    neutralLayerCardContainer,
    neutralLayerFloating,
} from "./recipes";
import { Footer } from "./site-footer";
class App extends React.Component {
    constructor() {
        super(...arguments);
        this.colorBlockScrollerRef = React.createRef();
        this.containerStyleOverrides = {
            container: {
                width: "100%",
                minHeight: "100%",
            },
        };
        this.backgroundRecipes = [
            [neutralLayerFloating, "neutralLayerFloating"],
            [neutralLayerCardContainer, "neutralLayerCardContainer"],
            [neutralLayer1, "neutralLayer1"],
            [neutralLayer2, "neutralLayer2"],
            [neutralLayer3, "neutralLayer3"],
            [neutralLayer4, "neutralLayer4"],
        ];
        this.handleGradientScroll = (index, align) => {
            if (this.colorBlockScrollerRef.current !== null) {
                this.colorBlockScrollerRef.current.scrollToItem(index, align);
            }
        };
        this.renderColorBlockList = props => {
            const backgrounds = this.backgrounds();
            return (
                <FixedSizeList
                    width={props.width}
                    height={props.height}
                    itemSize={400}
                    layout={"horizontal"}
                    itemCount={backgrounds.length}
                    itemKey={index => backgrounds[index].color}
                    ref={this.colorBlockScrollerRef}
                    itemData={backgrounds}
                >
                    {this.renderColorBlock}
                </FixedSizeList>
            );
        };
        this.renderColorBlock = props => {
            const color = props.data[props.index].color;
            const index = this.props.designSystem.neutralPalette.indexOf(color);
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
        this.resolveRecipes = luminance => {
            const designSystem = Object.assign({}, this.props.designSystem, {
                baseLayerLuminance: luminance,
            });
            return this.backgroundRecipes
                .map(conf => ({
                    color: conf[0](designSystem),
                    title: conf[1],
                }))
                .reduce((accum, value) => {
                    const colorIndex = accum.findIndex(
                        config => config.color === value.color
                    );
                    return colorIndex === -1
                        ? accum.concat(value)
                        : accum.map((config, index) =>
                              index === colorIndex
                                  ? {
                                        color: value.color,
                                        title: value.title.concat(", ", config.title),
                                    }
                                  : config
                          );
                }, []);
        };
    }
    render() {
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
                                <Row fill={true}>
                                    <AutoSizer
                                        onResize={
                                            /* eslint-disable-next-line */
                                            /* this lambda is intentional - it forces the pure component to re-render */ () => {}
                                        }
                                    >
                                        {this.renderColorBlockList}
                                    </AutoSizer>
                                </Row>
                            </Container>
                        </Canvas>
                        <ControlPane />
                    </Row>
                </Container>
                <Footer />
            </DesignSystemProvider>
        );
    }
    backgrounds() {
        const neutralPalette = this.props.designSystem.neutralPalette;
        const neutralLayers = this.lightModeLayers.concat(this.darkModeLayers);
        return this.props.showOnlyRecommendedBackgrounds
            ? neutralLayers
            : neutralPalette.map(color => {
                  const neutralLayerIndex = neutralLayers.findIndex(
                      config => config.color === color
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
    get lightModeLayers() {
        return this.resolveRecipes(StandardLuminance.LightMode);
    }
    get darkModeLayers() {
        return this.resolveRecipes(StandardLuminance.DarkMode);
    }
}
function mapStateToProps(state) {
    return {
        designSystem: state.designSystem,
        neutralBaseColor: state.neutralBaseColor,
        accentBaseColor: state.accentBaseColor,
        showOnlyRecommendedBackgrounds: state.showOnlyRecommendedBackgrounds,
    };
}
export default connect(mapStateToProps)(App);
