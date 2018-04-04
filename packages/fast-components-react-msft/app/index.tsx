import * as React from "react";
import * as ReactDOM from "react-dom";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";
import Site, {
    componentFactory,
    ISiteProps,
    SiteCategory,
    SiteCategoryIcon,
    SiteCategoryItem
} from "@microsoft/fast-development-site-react";
import * as examples from "./examples";

<<<<<<< HEAD
=======
const items: ICategoryProps[] = [
    {
        name: "Fast Components",
        items: [
            examples.ButtonExamples,
            examples.DividerExamples
            examples.HypertextExamples
        ]
    }
];

>>>>>>> added hypertext references in react-msft and styles-msft
/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

/* tslint:disable */
function render(): void {
    ReactDOM.render(
        <div>
            <DesignSystemProvider designSystem={DesignSystemDefaults}>
                <Site title={"FAST Microsoft components"}>
                    <SiteCategory slot={"category"} name={"Building blocks"}>
                        <SiteCategoryIcon slot="category-icon">
                            <div dangerouslySetInnerHTML={{__html: glyphBuildingblocks}} />
                        </SiteCategoryIcon>
                    </SiteCategory>
                    <SiteCategory slot={"category"} name={"Components"}>
                        {componentFactory(examples)}
                    </SiteCategory>
                </Site>
            </DesignSystemProvider>
        </div>,
        root
    );
}

render();
