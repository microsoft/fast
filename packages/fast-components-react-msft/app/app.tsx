import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import Site, {
    componentFactory,
    formChildFromExamplesFactory,
    FormChildOption,
    ShellSlot,
    SiteCategory,
    SiteCategoryIcon,
    SiteTitle,
    SiteTitleBrand,
    Theme,
} from "@microsoft/fast-development-site-react";
import {
    DensityOffset,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import designSystemSchema from "../../fast-components-styles-msft/src/design-system/design-system.schema.json";
import { Plugin, PluginProps } from "@microsoft/fast-tooling-react";
import { HypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import React from "react";
import { Direction } from "@microsoft/fast-web-utilities";
import AdditionalPropsPlugin from "./utilities/additional-props.plugin";
import * as examples from "./examples";
import ColorPicker, { ColorConfig } from "./color-picker";
import reactHTMLElementExamples from "./components/react-html-element-child-option";
import reactSVGElementExamples from "./components/svg-svg-element-child-option";
import carouselHeroContentExamples from "./components/carousel-hero-content-child-options";
import carouselDarkImageContentExamples from "./components/carousel-dark-image-content-child-options";
import carouselLightImageContentExamples from "./components/carousel-light-image-content-child-options";
import pivotItemContentExamples from "./components/pivot-item-content-child-options";
import pivotItemTabExamples from "./components/pivot-item-tab-child-options";
import {
    ColorHSL,
    ColorPalette,
    ColorRGBA64,
    hslToRGB,
    parseColor,
    rgbToHSL,
} from "@microsoft/fast-colors";
import { clone, merge } from "lodash-es";

/* tslint:disable-next-line */
const sketchDesignKit = require("./fast-dna-msft-design-kit.sketch");

const formChildOptions: FormChildOption[] = [
    reactHTMLElementExamples,
    reactSVGElementExamples,
    carouselHeroContentExamples,
    carouselDarkImageContentExamples,
    carouselLightImageContentExamples,
    pivotItemContentExamples,
    pivotItemTabExamples,
].concat(formChildFromExamplesFactory(examples));

const dark: string = "#111111";
const light: string = "#FFFFFF";
const accent: string = "#0078D4";

const formPlugins: Array<Plugin<PluginProps>> = [
    new AdditionalPropsPlugin({
        id: [
            "@microsoft/fast-components-react-msft/action-toggle/selectedGlyph",
            "@microsoft/fast-components-react-msft/action-toggle/unselectedGlyph",
            "@microsoft/fast-components-react-msft/action-trigger/glyph",
            "@microsoft/fast-components-react-msft/breadcrumb/separator",
            "@microsoft/fast-components-react-msft/button/beforeContent",
            "@microsoft/fast-components-react-msft/button/afterContent",
            "@microsoft/fast-components-react-msft/carousel/items/content",
            "@microsoft/fast-components-react-msft/select-option/glyph",
            "@microsoft/fast-components-react-msft/pivot/items/content",
            "@microsoft/fast-components-react-msft/pivot/items/tab",
            "@microsoft/fast-components-react-msft/text-action/afterGlyph",
            "@microsoft/fast-components-react-msft/text-action/beforeGlyph",
            "@microsoft/fast-components-react-msft/text-action/button",
        ],
    }),
];

enum ThemeName {
    dark = "dark",
    light = "light",
    custom = "custom",
}

export interface AppState extends ColorConfig {
    theme: ThemeName;
    designSystem: DesignSystem;
}

export default class App extends React.Component<{}, AppState> {
    private themes: Theme[] = [
        {
            id: ThemeName.light,
            displayName: ThemeName.light,
            background: light,
        },
        {
            id: ThemeName.dark,
            displayName: ThemeName.dark,
            background: dark,
        },
        { id: ThemeName.custom, displayName: ThemeName.custom },
    ];

    constructor(props: {}) {
        super(props);

        this.state = {
            accentColor: accent,
            designSystem: Object.assign({}, DesignSystemDefaults, {
                accentPalette: this.createColorPalette(parseColor(accent)),
                neutralPalette: this.createColorPalette(
                    new ColorRGBA64(0.5, 0.5, 0.5, 1)
                ),
                direction: Direction.ltr,
            }),
            backgroundColor: DesignSystemDefaults.backgroundColor,
            theme: ThemeName.light,
        };
    }

    public render(): JSX.Element {
        console.log("Rendering!");
        return (
            <Site
                formChildOptions={formChildOptions}
                formPlugins={formPlugins}
                onUpdateDirection={this.handleUpdateDirection}
                onUpdateTheme={this.handleUpdateTheme}
                themes={this.themes}
                activeTheme={this.getThemeById(this.state.theme)}
                showTransparencyToggle={true}
                styleEditing={true}
                designSystemEditing={{
                    data: this.getDesignSystem(),
                    schema: designSystemSchema,
                    designSystemOnChange: this.handleDesignSystemUpdate,
                }}
            >
                <SiteTitle slot={"title"}>
                    <SiteTitleBrand>FAST</SiteTitleBrand> Documentation
                </SiteTitle>
                <SiteCategory slot={"category"} name={"Building blocks"}>
                    <SiteCategoryIcon slot="category-icon">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: glyphBuildingblocks,
                            }}
                        />
                    </SiteCategoryIcon>
                </SiteCategory>
                <SiteCategory slot={"category"} name={"Components"}>
                    {this.sortExamples(componentFactory(examples))}
                </SiteCategory>
                <div slot={ShellSlot.infoBar}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <label style={{ marginRight: "8px" }}>density</label>
                        <input
                            type="range"
                            name="density"
                            defaultValue="0"
                            min="-3"
                            max="3"
                            onChange={this.handleDensityUpdate}
                        />
                        <ColorPicker
                            backgroundColor={this.state.backgroundColor}
                            accentColor={this.state.accentColor}
                            onColorUpdate={this.handleColorUpdate}
                        />
                    </div>
                </div>
            </Site>
        );
    }

    private getDesignSystem(): DesignSystem {
        console.log(
            "get deisgn system",
            clone(
                merge({}, this.state.designSystem, {
                    accentPalette: this.state.designSystem.accentPalette,
                    neutralPalette: this.state.designSystem.neutralPalette,
                    direction: this.state.designSystem.direction,
                    backgroundColor: this.state.backgroundColor,
                    density: this.state.designSystem.density,
                })
            )
        );
        return clone(
            merge({}, this.state.designSystem, {
                accentPalette: this.state.designSystem.accentPalette,
                neutralPalette: this.state.designSystem.neutralPalette,
                direction: this.state.designSystem.direction,
                backgroundColor: this.state.backgroundColor,
                density: this.state.designSystem.density,
            })
        );
    }

    private getThemeById(id: ThemeName): Theme {
        return this.themes.find(
            (theme: Theme): boolean => {
                return theme.id === id;
            }
        );
    }

    private handleUpdateDirection = (direction: Direction): void => {
        const newDir: Direction =
            this.state.designSystem.direction === Direction.ltr
                ? Direction.rtl
                : Direction.ltr;

        if (this.state.designSystem.direction === newDir) {
            return;
        }

        this.setState({
            designSystem: clone(
                merge({}, this.state.designSystem, {
                    direction: newDir,
                })
            ),
        });
    };

    private handleUpdateTheme = (theme: ThemeName): void => {
        if (theme !== ThemeName.custom) {
            this.setState({
                theme,
                backgroundColor: theme === ThemeName.dark ? dark : light,
            });
        } else {
            this.setCustomThemeBackground(this.state.backgroundColor);
            this.setState({
                theme,
            });
        }
    };

    private handleDesignSystemUpdate = (data: any): void => {
        if (data !== this.state.designSystem) {
            this.setState({
                designSystem: data,
            });
        }
    };

    /**
     * Handles any changes made by the user to the color picker inputs
     */
    private handleColorUpdate = (config: ColorConfig): void => {
        this.setCustomThemeBackground(config.backgroundColor);
        const updates: Partial<AppState> = { ...config };

        if (config.backgroundColor !== this.state.backgroundColor) {
            if (this.state.theme !== ThemeName.custom) {
                updates.theme = ThemeName.custom;
            }

            const color: ColorRGBA64 = parseColor(config.backgroundColor);
            const hslColor: ColorHSL = rgbToHSL(color);
            const augmentedHSLColor: ColorHSL = ColorHSL.fromObject({
                h: hslColor.h,
                s: hslColor.s,
                l: 0.5,
            });
            updates.designSystem.neutralPalette = this.createColorPalette(
                hslToRGB(augmentedHSLColor)
            );
        }

        if (config.accentColor !== this.state.accentColor) {
            updates.designSystem.accentPalette = this.createColorPalette(
                parseColor(config.accentColor)
            );
        }

        this.setState(updates as AppState);
    };

    private createColorPalette(baseColor: ColorRGBA64): string[] {
        return new ColorPalette({
            baseColor,
            steps: 63,
            clipLight: 0,
            clipDark: 0,
        }).palette.map((color: ColorRGBA64): string => color.toStringHexRGB());
    }

    private handleDensityUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            designSystem: clone(
                merge({}, this.state.designSystem, {
                    density: parseInt(e.target.value, 10) as DensityOffset,
                })
            ),
        });
    };
    /**
     * Assign a background color to the custom theme so that it can be applied to the background of the examples view
     * @param value The color to assign
     */
    private setCustomThemeBackground(value: string): void {
        this.themes = this.themes.map(
            (theme: Theme): Theme => {
                return theme.id !== ThemeName.custom
                    ? theme
                    : Object.assign({}, theme, { background: value });
            }
        );
    }

    /**
     * Sorts an array of examples in alphabetical order
     */
    private sortExamples(categoryExamples: JSX.Element[]): JSX.Element[] {
        return categoryExamples.sort(
            (a: JSX.Element, b: JSX.Element): number =>
                a.props.name.localeCompare(b.props.name)
        );
    }
}
