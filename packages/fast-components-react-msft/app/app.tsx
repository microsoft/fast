import Site, {
    componentFactory,
    formChildFromExamplesFactory,
    IFormChildOption,
    ISiteProps,
    ITheme,
    ShellSlot,
    SiteCategory,
    SiteCategoryIcon,
    SiteCategoryItem,
    SiteMenu,
    SiteMenuItem,
    SiteTitle,
    SiteTitleBrand
} from "@microsoft/fast-development-site-react";
import * as React from "react";
import manageJss, { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { DesignSystemDefaults, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import { IHypertextClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
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

enum Theme {
    dark = "dark",
    light = "light",
    custom = "custom"
}

export interface IAppState extends IColorConfig {
    theme: Theme;
    direction: Direction;
    density: number;
}

export default class App extends React.Component<{}, IAppState> {
    private themes: ITheme[] = [
        {id: Theme.light, displayName: Theme.light, background: DesignSystemDefaults.backgroundColor},
        {id: Theme.dark, displayName: Theme.dark, background: DesignSystemDefaults.foregroundColor},
        {id: Theme.custom, displayName: Theme.custom}
    ];

    constructor(props: {}) {
        super(props);

        this.state = {
            direction: Direction.ltr,
            foregroundColor: DesignSystemDefaults.foregroundColor,
            backgroundColor: DesignSystemDefaults.backgroundColor,
            accentColor: DesignSystemDefaults.brandColor,
            theme: Theme.light,
            density: DesignSystemDefaults.density
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
                showTransparencyToggle={true}
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
                    <span style={{display: "flex", alignItems: "center", height: "100%"}}>
                        <label style={{marginRight: "8px"}}>density</label>
                        <input
                            type="range"
                            name="density"
                            defaultValue="0"
                            min="-3"
                            max="3"
                            step="0.1"
                            onChange={this.handleDensityUpdate}
                        />
                        <ColorPicker
                            foregroundColor={this.state.foregroundColor}
                            backgroundColor={this.state.backgroundColor}
                            accentColor={this.state.accentColor}
                            onColorUpdate={this.handleColorUpdate}
                        />
                    </span>
                </div>
            </Site>
        );
    }

    private getThemeById(id: Theme): ITheme {
        return this.themes.find((theme: ITheme): boolean => {
            return theme.id === id;
        });
    }

    private generateDesignSystem(): IDesignSystem {
        const designSystem: Partial<IDesignSystem> = {
            direction: this.state.direction,
            foregroundColor: this.state.foregroundColor,
            backgroundColor: this.state.backgroundColor,
            brandColor: this.state.accentColor,
            density: this.state.density
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

    private handleUpdateTheme = (theme: Theme): void => {
        if (theme !== Theme.custom) {
            this.setState({
                theme,
                foregroundColor: theme === Theme.dark ? DesignSystemDefaults.backgroundColor : DesignSystemDefaults.foregroundColor,
                backgroundColor: theme === Theme.dark ? DesignSystemDefaults.foregroundColor : DesignSystemDefaults.backgroundColor
            });
        } else {
            this.setCustomThemeBackground(this.state.backgroundColor);
            this.setState({
                theme
            });
        }
    }

    /**
     * Handles any changes made by the user to the color picker inputs
     */
    private handleColorUpdate = (config: IColorConfig): void => {
        this.setCustomThemeBackground(config.backgroundColor);
        this.setState(
            config.backgroundColor !== this.state.backgroundColor || config.foregroundColor !== this.state.foregroundColor
            ? { theme: Theme.custom, ...config }
            : config
        );
    }

    private handleDensityUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value: number = +e.target.value;
        this.setState({
            density: value
        });
    }

    /**
     * Assign a background color to the custom theme so that it can be applied to the background of the examples view
     * @param value The color to assign
     */
    private setCustomThemeBackground(value: string): void {
        this.themes = this.themes.map((theme: ITheme): ITheme => {
            return theme.id !== Theme.custom ? theme : Object.assign({}, theme, { background: value});
        });
    }
}
