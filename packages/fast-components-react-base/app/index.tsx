import * as React from "react";
import * as ReactDOM from "react-dom";
import Site, {
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

function componentFactory(): JSX.Element[] {
    return Object.keys(examples).map((exampleKey: string) => {
        return (
            <SiteCategory slot={"category"} name={exampleKey}>
                {componentExampleFactory(exampleKey)}
            </SiteCategory>
        );
    });
}

function componentExampleFactory(componentName: string): JSX.Element[] {
    const Component: any = examples[componentName].component;

    return examples[componentName].data.map((componentExample: any) => {
        return (
            <SiteCategoryItem slot={"canvas"}>
                <Component {...componentExample} />
            </SiteCategoryItem>
        );
    });
}

/* tslint:disable */
function render(): void {
    ReactDOM.render(
        <Site title={"FAST components base"}>
            <SiteCategory slot={"category"} name={"Building blocks"}>
                <SiteCategoryIcon slot="category-icon">
                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                        <title>building-blocks</title>
                        <path d="M25.2,16h3V30H2.2V4h14V7l7-7,9,9Zm-21,0h10V6H4.2Zm10,2H4.2V28h10Zm2-7v5h5Zm0,7V28h10V18Zm.47-9,6.53,6.54L29.73,9,23.2,2.46Z"/>
                    </svg>
                </SiteCategoryIcon>
            </SiteCategory>
            <SiteCategory slot={"category"} name={"Components"}>
                {componentFactory()}
            </SiteCategory>
        </Site>,
        root
    );
}

render();
