import * as React from "react";
import * as ReactDOM from "react-dom";
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
        <Site title={"FAST base component documentation"} formChildOptions={formChildOptions}>
            <SiteCategory slot={"category"} name={"Components"}>
                {componentFactory(examples)}
            </SiteCategory>
        </Site>,
        root
    );
}

render();
