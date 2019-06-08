import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import { Plugin, PluginProps } from "@microsoft/fast-tooling-react";
import React from "react";
import Site, {
    ComponentViewSlot,
    FormChildOption,
    SiteCategory,
    SiteCategoryDocumentation,
    SiteCategoryIcon,
    SiteCategoryItem,
    SiteMenu,
    SiteMenuItem,
    SiteTitle,
    SiteTitleBrand,
    Theme,
} from "../src";
import { SiteCategoryProps, Status } from "../src/components/site/category";
import { Framework } from "../src/components/site/dev-tools";
import { Button, Paragraph, Span } from "./components";
import ButtonDocs from "./components/button/.tmp/documentation";
import ButtonSchema from "./components/button/button.schema.json";
import ParagraphDocs from "./components/paragraph/.tmp/documentation";
import {
    default as ParagraphSchema,
    default as SpanSchema,
} from "./components/paragraph/paragraph.schema.json";
import { Direction } from "./design-system";
import TextPlugin from "./plugins/text-plugin";

export interface AppState {
    direction: Direction;
    theme: string;
}

const themes: Theme[] = [
    { id: "Foo", displayName: "Foo", background: "#111" },
    { id: "Bar", displayName: "Bar", background: "#FFF" },
    { id: "Bat", displayName: "Bat", background: "#222" },
];

export default class App extends React.Component<{}, AppState> {
    private formChildOptions: FormChildOption[] = [
        {
            name: ParagraphSchema.title,
            component: Paragraph,
            schema: ParagraphSchema,
        },
        {
            name: ButtonSchema.title,
            component: Button,
            schema: ButtonSchema,
        },
        {
            name: SpanSchema.title,
            component: Span,
            schema: SpanSchema,
        },
    ];

    private formPlugins: Array<Plugin<PluginProps>> = [
        new TextPlugin({
            id: "text-plugin",
        }),
    ];

    private frameworks: Framework[];

    constructor(props: {}) {
        super(props);

        this.frameworks = [Framework.react, Framework.angular];

        this.state = {
            direction: Direction.ltr,
            theme: "Foo",
        };
    }

    public render(): JSX.Element {
        return (
            <Site
                formChildOptions={this.formChildOptions}
                formPlugins={this.formPlugins}
                frameworks={this.frameworks}
                onUpdateDirection={this.handleUpdateDirection}
                themes={themes}
                onUpdateTheme={this.handleUpdateTheme}
                showComponentStatus={true}
                showTransparencyToggle={true}
                styleEditing={true}
            >
                {this.renderSiteTitle()}
                {this.renderSiteMenu()}
                {this.renderBuildingBlocks()}
                {this.renderComponents()}
            </Site>
        );
    }

    private renderSiteTitle(): JSX.Element {
        return (
            <SiteTitle slot="title">
                <SiteTitleBrand>FAST</SiteTitleBrand> Documentation site
            </SiteTitle>
        );
    }

    private renderComponents(): JSX.Element {
        const buttonTestCategoryBase: Partial<SiteCategoryProps> = {
            slot: "category",
            schema: ButtonSchema,
            component: Button,
            status: Status.released,
        };
        const buttonTestComponents: any[] = [
            { children: "foo" },
            { children: "bar" },
            { children: "bat" },
        ];
        const buttonTestCategory: Partial<SiteCategoryProps> = {
            ...buttonTestCategoryBase,
            name: "Button",
        };
        const otherButtonTestComponents: any[] = [
            { children: "lorem" },
            { children: "ipsum" },
        ];
        const otherButtonTestCategory: Partial<SiteCategoryProps> = {
            ...buttonTestCategoryBase,
            name: "Other Button",
        };
        const paragraphTestComponents: any[] = [
            { text: "itsy" },
            { text: "bitsy" },
            { text: "spider" },
        ];
        const paragraphTestCategory: SiteCategoryProps = {
            slot: "category",
            name: "Paragraph",
            schema: ParagraphSchema,
            component: Paragraph,
            status: Status.alpha,
        };

        return (
            <SiteCategory slot={"category"} name={"Components"}>
                {this.renderCategory(
                    buttonTestComponents,
                    buttonTestCategory as SiteCategoryProps
                )}
                {this.renderCategory(
                    otherButtonTestComponents,
                    otherButtonTestCategory as SiteCategoryProps
                )}
                {this.renderCategory(paragraphTestComponents, paragraphTestCategory)}
            </SiteCategory>
        );
    }

    private renderCategory(
        componentObj: any[],
        categoryObj: SiteCategoryProps
    ): JSX.Element {
        return (
            <SiteCategory {...categoryObj}>
                {this.renderComponentsFactory(componentObj)}
                {this.renderDocumentation(categoryObj)}
            </SiteCategory>
        );
    }

    private renderDocumentation(categoryObj: SiteCategoryProps): JSX.Element {
        switch (categoryObj.name) {
            case "Paragraph Nested":
            case "Paragraph":
                return (
                    <SiteCategoryDocumentation slot={"canvas-detail-view-documentation"}>
                        <ParagraphDocs />
                    </SiteCategoryDocumentation>
                );
            case "Other Button":
            case "Button":
                return (
                    <SiteCategoryDocumentation slot={"canvas-detail-view-documentation"}>
                        <ButtonDocs />
                    </SiteCategoryDocumentation>
                );
            case "Span":
                return (
                    <SiteCategoryDocumentation
                        slot={"canvas-detail-view-documentation"}
                    />
                );
            default:
                return null;
        }
    }

    private renderComponentsFactory(componentData: any[]): JSX.Element[] {
        return componentData.map((componentDataItem: any, index: number) => {
            return (
                <SiteCategoryItem
                    slot={
                        index === 0
                            ? ComponentViewSlot.detailExample
                            : ComponentViewSlot.example
                    }
                    key={index}
                    data={componentDataItem}
                    designSystem={{ ltr: this.state.direction }}
                />
            );
        });
    }

    private renderBuildingBlocks(): JSX.Element {
        return (
            <SiteCategory slot={"category"} name={"Building blocks"}>
                <SiteCategoryIcon slot="category-icon">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: glyphBuildingblocks,
                        }}
                    />
                </SiteCategoryIcon>
            </SiteCategory>
        );
    }

    private renderSiteMenu(): JSX.Element {
        return (
            <SiteMenu slot={"header"}>
                <SiteMenuItem>Hello</SiteMenuItem>
                <SiteMenuItem>World</SiteMenuItem>
            </SiteMenu>
        );
    }

    private handleUpdateDirection = (direction: Direction): void => {
        this.setState({
            direction,
        });
    };

    private handleUpdateTheme = (theme: string): void => {
        this.setState({
            theme,
        });
    };
}
