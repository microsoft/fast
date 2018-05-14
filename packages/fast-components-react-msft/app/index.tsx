import * as React from "react";
import * as ReactDOM from "react-dom";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";
import Site, {
    componentFactory,
    formChildFromExamplesFactory,
    IFormChildOption,
    ISiteProps,
    SiteCategory,
    SiteCategoryIcon,
    SiteCategoryItem
} from "@microsoft/fast-development-site-react";
import * as examples from "./examples";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

const formChildOptions: IFormChildOption[] = formChildFromExamplesFactory(examples);

/* tslint:disable */
function render(): void {
    ReactDOM.render(
        <div>
            <DesignSystemProvider designSystem={DesignSystemDefaults}>
                <Site title={"FAST Microsoft components"} formChildOptions={formChildOptions}>
                    <SiteCategory slot={"category"} name={"Building blocks"}>
                        <SiteCategoryIcon slot="category-icon">
                            <div dangerouslySetInnerHTML={{__html: glyphBuildingblocks}} />
                        </SiteCategoryIcon>
                    </SiteCategory>
                    <SiteCategory slot={"category"} name={"Components"}>
                        {componentFactory(examples, DesignSystemDefaults)}
                    </SiteCategory>
                </Site>
            </DesignSystemProvider>
        </div>,
        root
    );
}

render();
