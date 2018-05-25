import * as React from "react";
import * as ReactDOM from "react-dom";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import Site, {
    IFormChildOption,
    SiteCategory,
    SiteCategoryDocumentation,
    SiteCategoryIcon,
    SiteCategoryItem,
    SiteMenu,
    SiteMenuItem
} from "../src";
import Button from "./components/button/button";
import ButtonSchema from "./components/button/button.schema.json";
import Paragraph from "./components/paragraph/paragraph";
import ParagraphSchema from "./components/paragraph/paragraph.schema.json";
import PolymerHeading from "./components/polymer-heading";
import { ISiteCategoryProps } from "../src/components/site/category";
import ParagraphDocs from "./components/paragraph/.tmp/documentation";
import ButtonDocs from "./components/button/.tmp/documentation";

function renderSiteMenu(): JSX.Element {
    return (
        <SiteMenu slot={"header"}>
            <SiteMenuItem>Hello</SiteMenuItem>
            <SiteMenuItem>World</SiteMenuItem>
        </SiteMenu>
    );
}

function renderBuildingBlocks(): JSX.Element {
    return (
        <SiteCategory slot={"category"} name={"Building blocks"}>
            <SiteCategoryIcon slot="category-icon">
                <div dangerouslySetInnerHTML={{__html: glyphBuildingblocks}} />
            </SiteCategoryIcon>
        </SiteCategory>
    );
}

function renderComponentsFactory(componentData: any[]): JSX.Element[] {
    return componentData.map((componentDataItem: any, index: number) => {
        return (
            <SiteCategoryItem
                slot={index === 0 ? "canvas-detail-view-example" : "canvas-example-view"}
                key={index}
                data={componentDataItem}
            />
        );
    });
}

function renderDocumentation(categoryObj: ISiteCategoryProps): JSX.Element {
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
        default:
            return null;
    }
}

function renderCategory(componentObj: any[], categoryObj: ISiteCategoryProps): JSX.Element {
    return (
        <SiteCategory {...categoryObj}>
            {renderComponentsFactory(componentObj)}
            {renderDocumentation(categoryObj)}
        </SiteCategory>
    );
}

function renderComponents1(): JSX.Element {
    const categoryBase: Partial<ISiteCategoryProps> = {
        slot: "category",
        schema: ButtonSchema,
        component: Button
    };
    const componentObj1: any[] = [{text: "foo"}, {text: "bar"}, {text: "bat"}];
    const categoryObj1: Partial<ISiteCategoryProps> = {
        ...categoryBase,
        name: "Button"
    };
    const componentObj2: any[] = [{text: "lorem"}, {text: "ipsum"}];
    const categoryObj2: Partial<ISiteCategoryProps> = {
        ...categoryBase,
        name: "Other Button"
    };

    return (
        <SiteCategory slot={"category"} name={"Components"}>
            {renderCategory(componentObj1, categoryObj1 as ISiteCategoryProps)}
            {renderCategory(componentObj2, categoryObj2 as ISiteCategoryProps)}
        </SiteCategory>
    );
}

function renderComponents2(): JSX.Element {
    const componentObj: any[] = [{text: "itsy"}, {text: "bitsy"}, {text: "spider"}];
    const categoryObj: ISiteCategoryProps = {
        slot: "category",
        name: "Paragraph",
        schema: ParagraphSchema,
        component: Paragraph
    };

    return (
        <SiteCategory slot={"category"} name={"Components 2"}>
            {renderCategory(componentObj, categoryObj)}
            {renderComponents2Nested()}
        </SiteCategory>
    );
}

function renderComponents2Nested(): JSX.Element {
    const componentObj: any[] = [{text: "fee"}, {text: "fi"}, {text: "fo"}, {text: "fum"}];
    const categoryObj: ISiteCategoryProps = {
        slot: "category",
        name: "Paragraph Nested",
        schema: ParagraphSchema,
        component: Paragraph
    };

    return (
        <SiteCategory slot={"category"} name={"Components 2 nested"}>
            {renderCategory(componentObj, categoryObj)}
        </SiteCategory>
    );
}

const formChildOptions: IFormChildOption[] = [
    {
        name: ParagraphSchema.title,
        component: Paragraph,
        schema: ParagraphSchema
    },
    {
        name: ButtonSchema.title,
        component: Button,
        schema: ButtonSchema
    }
];

function render(): void {
    ReactDOM.render(
        <Site
            title={"FAST Documentation site"}
            formChildOptions={formChildOptions}
            frameworks={["react" as any, "angular" as any]}
        >
            {renderSiteMenu()}
            {renderBuildingBlocks()}
            {renderComponents1()}
            {renderComponents2()}
        </Site>,
        document.getElementById("root")
    );
}

render();
