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
    SiteCategory,
    SiteCategoryIcon,
    SiteCategoryItem,
    SiteMenu,
    SiteMenuItem,
    SiteTitle,
    SiteTitleBrand,
} from "@microsoft/fast-development-site-react";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { Direction } from "@microsoft/fast-application-utilities";
import * as examples from "./examples";
import Hypertext from "../src/hypertext";

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

export interface IAppState {
    direction: Direction;
    theme: string;
}

const themes: any[] = [
    {id: "light", displayName: "light", background: DesignSystemDefaults.backgroundColor},
    {id: "dark", displayName: "dark", background: DesignSystemDefaults.foregroundColor}
];

export default class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            direction: Direction.ltr,
            theme: "light"
        };
    }

    public render(): JSX.Element {
        return (
            <Site
                formChildOptions={formChildOptions}
                onUpdateDirection={this.handleUpdateDirection}
                onUpdateTheme={this.handleUpdateTheme}
                themes={themes}
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
            </Site>
        );
    }

    private generateDesignSystem(): IDesignSystem {
        const designSystem: Partial<IDesignSystem> = {
            direction: this.state.direction,
            foregroundColor: this.state.theme === "dark" ? DesignSystemDefaults.backgroundColor : DesignSystemDefaults.foregroundColor,
            backgroundColor: this.state.theme === "dark" ? DesignSystemDefaults.foregroundColor : DesignSystemDefaults.backgroundColor
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

    private handleUpdateTheme = (theme: string): void => {
        this.setState({
            theme
        });
    }
}
