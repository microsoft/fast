import * as React from "react";
import * as ReactDOM from "react-dom";
import Site, { SiteCategory, SiteCategoryIcon, SiteCategoryItem, SiteMenu, SiteMenuItem } from "../src";

import Button from "./components/button";
import Paragraph from "./components/paragraph";
import PolymerHeading from "./components/polymer-heading";

/* tslint:disable-next-line */
const buildingBlocksPath = "M25.2,16h3V30H2.2V4h14V7l7-7,9,9Zm-21,0h10V6H4.2Zm10,2H4.2V28h10Zm2-7v5h5Zm0,7V28h10V18Zm.47-9,6.53,6.54L29.73,9,23.2,2.46Z";

const render: any = (): void => {
    ReactDOM.render(
        <Site title={"FAST Development site test"}>
            <SiteMenu slot={"header"}>
                <SiteMenuItem>Hello</SiteMenuItem>
                <SiteMenuItem>World</SiteMenuItem>
            </SiteMenu>
            <SiteCategory slot={"category"} name={"Building blocks"}>
                <SiteCategoryIcon slot="category-icon">
                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                        <title>building-blocks</title>
                        <path d={buildingBlocksPath}/>
                    </svg>
                </SiteCategoryIcon>
            </SiteCategory>
            <SiteCategory slot={"category"} name={"Components 1"}>
                <SiteCategory slot={"category"} name={"Button"}>
                    <SiteCategoryItem slot={"canvas"}>
                        <Button>foo</Button>
                    </SiteCategoryItem>
                    <SiteCategoryItem slot={"canvas"}>
                        <Button>bar</Button>
                    </SiteCategoryItem>
                    <SiteCategoryItem slot={"canvas"}>
                        <Button>bat</Button>
                    </SiteCategoryItem>
                </SiteCategory>
                <SiteCategory slot={"category"} name={"Button 2"}>
                    <SiteCategoryItem slot={"canvas"}>
                        <Button>foo 2</Button>
                    </SiteCategoryItem>
                    <SiteCategoryItem slot={"canvas"}>
                        <Button>bar 2</Button>
                    </SiteCategoryItem>
                    <SiteCategoryItem slot={"canvas"}>
                        <Button>bat 2</Button>
                    </SiteCategoryItem>
                </SiteCategory>
            </SiteCategory>
            <SiteCategory slot={"category"} name={"Components 2"}>
                <SiteCategory slot={"category"} name={"Paragraph"}>
                    <SiteCategoryItem slot={"canvas"}>
                        <Paragraph>itsy</Paragraph>
                    </SiteCategoryItem>
                    <SiteCategoryItem slot={"canvas"}>
                        <Paragraph>bitsy</Paragraph>
                    </SiteCategoryItem>
                    <SiteCategoryItem slot={"canvas"}>
                        <Paragraph>spider</Paragraph>
                    </SiteCategoryItem>
                </SiteCategory>
                <SiteCategory slot={"category"} name={"Components 2 nested"}>
                    <SiteCategory slot={"category"} name={"Paragraph 2 nested"}>
                        <SiteCategoryItem slot={"canvas"}>
                            <Paragraph>went</Paragraph>
                        </SiteCategoryItem>
                        <SiteCategoryItem slot={"canvas"}>
                            <Paragraph>up</Paragraph>
                        </SiteCategoryItem>
                        <SiteCategoryItem slot={"canvas"}>
                            <Paragraph>spout</Paragraph>
                        </SiteCategoryItem>
                    </SiteCategory>
                </SiteCategory>
            </SiteCategory>
        </Site>,
        document.getElementById("root")
    );
};

render();
