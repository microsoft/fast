import * as React from "react";
import * as ReactDOM from "react-dom";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import Site, { SiteCategory, SiteCategoryIcon, SiteCategoryItem, SiteMenu, SiteMenuItem } from "../src";
import Button from "./components/button";
import Paragraph from "./components/paragraph";
import PolymerHeading from "./components/polymer-heading";

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

function renderComponentsFactory(componentStrings: string[], Component: any): JSX.Element[] {
    return componentStrings.map((componentString: string, index: number) => {
        return (
            <SiteCategoryItem slot={"canvas"} key={index}>
                <Component>{componentString}</Component>
            </SiteCategoryItem>
        );
    });
}

function renderComponents1(): JSX.Element {
    return (
        <SiteCategory slot={"category"} name={"Components"}>
            <SiteCategory slot={"category"} name={"Button 1"}>
                {renderComponentsFactory(["foo", "bar", "bat"], Button)}
            </SiteCategory>
            <SiteCategory slot={"category"} name={"Button 2"}>
                {renderComponentsFactory(["foo 1", "bar 2", "bat 3"], Button)}
            </SiteCategory>
        </SiteCategory>
    );
}

function renderComponents2(): JSX.Element {
    return (
        <SiteCategory slot={"category"} name={"Components 2"}>
            <SiteCategory slot={"category"} name={"Paragraph"}>
                {renderComponentsFactory(["itsy", "bitsy", "spider"], Paragraph)}
            </SiteCategory>
            {renderComponents2Nested()}
        </SiteCategory>
    );
}

function renderComponents2Nested(): JSX.Element {
    return (
        <SiteCategory slot={"category"} name={"Components 2 nested"}>
            <SiteCategory slot={"category"} name={"Paragraph 2 nested"}>
                {renderComponentsFactory(["fee", "fi", "fo", "fum"], Paragraph)}
            </SiteCategory>
        </SiteCategory>
    );
}

function render(): void {
    ReactDOM.render(
        <Site title={"FAST Development site test"}>
            {renderSiteMenu()}
            {renderBuildingBlocks()}
            {renderComponents1()}
            {renderComponents2()}
        </Site>,
        document.getElementById("root")
    );
}

render();
