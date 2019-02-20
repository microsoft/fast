import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import Site, {
    componentFactory,
    formChildFromExamplesFactory,
    FormChildOption,
    ShellSlot,
    SiteCategory,
    SiteCategoryIcon,
    SiteCategoryItem,
    SiteMenu,
    SiteMenuItem,
    SiteProps,
    SiteTitle,
    SiteTitleBrand,
    Theme,
} from "@microsoft/fast-development-site-react";
import manageJss, { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { Plugin, PluginProps } from "@microsoft/fast-data-utilities-react";
import {
    HypertextClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import * as React from "react";
import { Direction } from "@microsoft/fast-application-utilities";
import AdditionalPropsPlugin from "./utilities/additional-props.plugin";
import * as examples from "./examples";
import { Hypertext } from "../src/hypertext";
import ColorPicker, { ColorConfig } from "./color-picker";
import reactHTMLElementExamples from "./components/react-html-element-child-option";
import reactSVGElementExamples from "./components/svg-svg-element-child-option";
import carouselHeroContentExamples from "./components/carousel-hero-content-child-options";
import carouselDarkImageContentExamples from "./components/carousel-dark-image-content-child-options";
import carouselLightImageContentExamples from "./components/carousel-light-image-content-child-options";
import { Label } from "../src/label";

/* tslint:disable-next-line */
const sketchDesignKit = require("./fast-dna-msft-design-kit.sketch");

const formChildOptions: FormChildOption[] = [
    reactHTMLElementExamples,
    reactSVGElementExamples,
    carouselHeroContentExamples,
    carouselDarkImageContentExamples,
    carouselLightImageContentExamples,
].concat(formChildFromExamplesFactory(examples));

const formPlugins: Array<Plugin<PluginProps>> = [
    new AdditionalPropsPlugin({
        id: [
            "@microsoft/fast-components-react-msft/action-toggle/selectedGlyph",
            "@microsoft/fast-components-react-msft/action-toggle/unselectedGlyph",
            "@microsoft/fast-components-react-msft/action-trigger/glyph",
            "@microsoft/fast-components-react-msft/button/beforeContent",
            "@microsoft/fast-components-react-msft/button/afterContent",
            "@microsoft/fast-components-react-msft/carousel/items/content",
            "@microsoft/fast-components-react-msft/text-action/beforeGlyph",
            "@microsoft/fast-components-react-msft/text-action/afterGlyph",
        ],
    }),
];

const hypertextStyles: ComponentStyles<HypertextClassNameContract, undefined> = {
    hypertext: {
        margin: "0 8px",
        display: "inline-block",
        lineHeight: "1",
        whiteSpace: "nowrap",
    },
};

enum ThemeName {
    dark = "dark",
    light = "light",
    custom = "custom",
}

export interface AppState extends ColorConfig {
    theme: ThemeName;
    direction: Direction;
    density: number;
}

export default class App extends React.Component<{}, AppState> {
    private themes: Theme[] = [
        {
            id: ThemeName.light,
            displayName: ThemeName.light,
            background: DesignSystemDefaults.backgroundColor,
        },
        {
            id: ThemeName.dark,
            displayName: ThemeName.dark,
            background: DesignSystemDefaults.foregroundColor,
        },
        { id: ThemeName.custom, displayName: ThemeName.custom },
    ];

    constructor(props: {}) {
        super(props);

        this.state = {
            direction: Direction.ltr,
            foregroundColor: DesignSystemDefaults.foregroundColor,
            backgroundColor: DesignSystemDefaults.backgroundColor,
            accentColor: DesignSystemDefaults.brandColor,
            theme: ThemeName.light,
            density: DesignSystemDefaults.density,
        };
    }

    public render(): JSX.Element {
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
                    {this.sortExamples(
                        componentFactory(examples, {
                            ...this.generateDesignSystem(),
                        })
                    )}
                </SiteCategory>
                <div slot={ShellSlot.infoBar}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        {/* Re-implement density slider with: https://github.com/Microsoft/fast-dna/issues/1139 */}
                        <Label style={{ marginRight: "8px", display: "none" }}>
                            density
                        </Label>
                        <input
                            type="range"
                            name="density"
                            defaultValue="1"
                            min="0"
                            max="2"
                            onChange={this.handleDensityUpdate}
                            style={{ display: "none" }}
                        />
                        <ColorPicker
                            foregroundColor={this.state.foregroundColor}
                            backgroundColor={this.state.backgroundColor}
                            accentColor={this.state.accentColor}
                            onColorUpdate={this.handleColorUpdate}
                        />
                    </div>
                </div>
            </Site>
        );
    }

    private getThemeById(id: ThemeName): Theme {
        return this.themes.find(
            (theme: Theme): boolean => {
                return theme.id === id;
            }
        );
    }

    private generateDesignSystem(): DesignSystem {
        const designSystem: Partial<DesignSystem> = {
            direction: this.state.direction,
            foregroundColor: this.state.foregroundColor,
            backgroundColor: this.state.backgroundColor,
            brandColor: this.state.accentColor,
            density: this.state.density,
        };

        return Object.assign({}, DesignSystemDefaults, designSystem);
    }

    private handleUpdateDirection = (direction: Direction): void => {
        const newDir: Direction =
            this.state.direction === Direction.ltr ? Direction.rtl : Direction.ltr;

        if (this.state.direction === newDir) {
            return;
        }

        this.setState({
            direction: newDir,
        });
    };

    private handleUpdateTheme = (theme: ThemeName): void => {
        if (theme !== ThemeName.custom) {
            this.setState({
                theme,
                foregroundColor:
                    theme === ThemeName.dark
                        ? DesignSystemDefaults.backgroundColor
                        : DesignSystemDefaults.foregroundColor,
                backgroundColor:
                    theme === ThemeName.dark
                        ? DesignSystemDefaults.foregroundColor
                        : DesignSystemDefaults.backgroundColor,
            });
        } else {
            this.setCustomThemeBackground(this.state.backgroundColor);
            this.setState({
                theme,
            });
        }
    };

    /**
     * Handles any changes made by the user to the color picker inputs
     */
    private handleColorUpdate = (config: ColorConfig): void => {
        this.setCustomThemeBackground(config.backgroundColor);
        const updates: Partial<AppState> = { ...config };

        if (
            config.backgroundColor !== this.state.backgroundColor ||
            config.foregroundColor !== this.state.foregroundColor
        ) {
            updates.theme = ThemeName.custom;
        }

        this.setState(updates as AppState);
    };

    private handleDensityUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            density: parseInt(e.target.value, 10),
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
