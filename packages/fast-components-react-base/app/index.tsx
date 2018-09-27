import * as React from "react";
import * as ReactDOM from "react-dom";
import Site, {
    componentFactory,
    formChildFromExamplesFactory,
    IFormChildOption,
    ISiteProps,
    SiteCategory,
    SiteCategoryIcon,
    SiteCategoryItem,
    SiteTitle,
    SiteTitleBrand
} from "@microsoft/fast-development-site-react";
import * as examples from "./examples";
import reactHTMLElementExamples from "./components/examples.data";

import {
    Tab,
    TabItem,
    TabPanel
} from "../src";
import TabSchema from "../src/tabs/tab.schema.json";
import TabItemSchema from "../src/tabs/tab-item.schema.json";
import TabPanelSchema from "../src/tabs/tab-panel.schema.json";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

let formChildOptions: IFormChildOption[] = [reactHTMLElementExamples].concat(formChildFromExamplesFactory(examples));

formChildOptions = formChildOptions.concat([
    {
        name: "Tab",
        component: Tab,
        schema: TabSchema
    },
    {
        name: "TabItem",
        component: TabItem,
        schema: TabItemSchema
    },
    {
        name: "TabPanel",
        component: TabPanel,
        schema: TabPanelSchema
    }
]);

/* tslint:disable */
function render(): void {
    ReactDOM.render(
        <Site formChildOptions={formChildOptions} showTransparencyToggle={true}>
            <SiteTitle slot={"title"}>
                <SiteTitleBrand>FAST</SiteTitleBrand> base component documentation
            </SiteTitle>
            <SiteCategory slot={"category"} name={"Components"}>
                {componentFactory(examples)}
            </SiteCategory>
        </Site>,
        root
    );
}

render();
