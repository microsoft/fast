import * as React from "react";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import manageJss, { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { DesignSystemDefaults, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import { IHypertextClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Site, {
    componentFactory,
    formChildFromExamplesFactory,
    IFormChildOption,
    ISiteProps,
    ITheme,
    SiteCategory,
    SiteCategoryIcon,
    SiteCategoryItem,
    SiteMenu,
    SiteMenuItem,
    SiteTitle,
    SiteTitleBrand,
    ShellSlot
} from "@microsoft/fast-development-site-react";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { Direction } from "@microsoft/fast-application-utilities";
import * as examples from "./examples";
import Hypertext from "../src/hypertext";
import ColorPicker, { IColorConfig } from "./color-picker";


/* tslint:disable-next-line */
const sketchDesignKit = require("./fast-dna-msft-design-kit.sketch");

const formChildOptions: IFormChildOption[] = formChildFromExamplesFactory(examples);

const hypertextStyles: ComponentStyles<IHypertextClassNameContract, undefined> = {
    hypertext: {
        margin: "0 8px",
        display: "inline-block",
        lineHeight: "1",
        whiteSpace: "nowrap"
    }
};

enum Themes {
    dark = "dark",
    light = "light",
    custom = "custom"
}

export interface IAppState extends IColorConfig {
    theme: Themes,
    direction: Direction;
}

const themes: ITheme[] = [
    {id: Themes.light, displayName: Themes.light, background: DesignSystemDefaults.backgroundColor},
    {id: Themes.dark, displayName: Themes.dark, background: DesignSystemDefaults.foregroundColor},
    {id: Themes.custom, displayName: Themes.custom}
];

export default class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            direction: Direction.ltr,
            foregroundColor: DesignSystemDefaults.foregroundColor,
            backgroundColor: DesignSystemDefaults.backgroundColor,
            accentColor: DesignSystemDefaults.brandColor,
            theme: Themes.light
        };
    }

    public render(): JSX.Element {
        return (
            <Site
                formChildOptions={formChildOptions}
                onUpdateDirection={this.handleUpdateDirection}
                onUpdateTheme={this.handleUpdateTheme}
                themes={this.themes}
                activeTheme={this.getThemeById(this.state.theme)}
            >
                <SiteMenu slot={"header"}>
                    <SiteMenuItem>
                        <Hypertext
                            jssStyleSheet={hypertextStyles}
                            href={sketchDesignKit}
                        >
                            Download design kit - sketch
                        </Hypertext>
                    </SiteMenuItem>
                </SiteMenu>
                <SiteTitle slot={"title"}>
                    <SiteTitleBrand>FAST</SiteTitleBrand> Documentation
                </SiteTitle>
                <SiteCategory slot={"category"} name={"Building blocks"}>
                    <SiteCategoryIcon slot="category-icon">
                        <div dangerouslySetInnerHTML={{__html: glyphBuildingblocks}} />
                    </SiteCategoryIcon>
                </SiteCategory>
                <SiteCategory slot={"category"} name={"Components"}>
                    {componentFactory(examples, {...this.generateDesignSystem()})}
                </SiteCategory>
                <div slot={ShellSlot.infoBar}>
                    <ColorPicker
                        foregroundColor={this.state.foregroundColor}
                        backgroundColor={this.state.backgroundColor}
                        accentColor={this.state.accentColor}
                        onColorUpdate={this.handleColorUpdate}
                    />
                </div>
            </Site>
        );
    }

    private themes: ITheme[] = [
        {id: Themes.light, displayName: Themes.light, background: DesignSystemDefaults.backgroundColor},
        {id: Themes.dark, displayName: Themes.dark, background: DesignSystemDefaults.foregroundColor},
        {id: Themes.custom, displayName: Themes.custom}
    ];

    private getThemeById(id: Themes): ITheme {
        return this.themes.find((theme: ITheme): boolean => {
            return theme.id === id;
        });
    }    

    private generateDesignSystem(): IDesignSystem {
        const designSystem: Partial<IDesignSystem> = {
            direction: this.state.direction,
            foregroundColor: this.state.foregroundColor,
            backgroundColor: this.state.backgroundColor,
            brandColor: this.state.accentColor
            // foregroundColor: this.state.theme === "dark" ? DesignSystemDefaults.backgroundColor : DesignSystemDefaults.foregroundColor,
            // backgroundColor: this.state.theme === "dark" ? DesignSystemDefaults.foregroundColor : DesignSystemDefaults.backgroundColor
        };

        return Object.assign({}, DesignSystemDefaults, designSystem);
    }

    private handleUpdateDirection = (direction: Direction): void => {
        const newDir: Direction = this.state.direction === Direction.ltr ? Direction.rtl : Direction.ltr;

        if (this.state.direction === newDir) { return; }

        this.setState({
            direction: newDir
        });
    }

    private handleUpdateTheme = (theme: Themes): void => {
        if (theme !== Themes.custom) {
            this.setState({
                foregroundColor: theme === Themes.dark ? DesignSystemDefaults.backgroundColor : DesignSystemDefaults.foregroundColor,
                backgroundColor: theme === Themes.dark ? DesignSystemDefaults.foregroundColor : DesignSystemDefaults.backgroundColor
            });
        } else {
            this.themes = this.themes.map((theme: ITheme): ITheme => {
                return theme.id !== Themes.custom ? theme : Object.assign({}, theme, { background: this.state.backgroundColor});
            });
        }

        this.setState({
            theme
        });
    }

    private handleColorUpdate = (config: IColorConfig): void => {
        this.setState({
            theme: Themes.custom,
            ...config
        });
    }
}