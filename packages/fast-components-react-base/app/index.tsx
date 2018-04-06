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
    return Object.keys(examples).map((exampleKey: string, index: number) => {
        return (
            <SiteCategory key={index} slot={"category"} name={exampleKey}>
                {componentExampleFactory(exampleKey)}
            </SiteCategory>
        );
    });
}

function componentExampleFactory(componentName: string): JSX.Element[] {
    const Component: any = examples[componentName].component;

    return examples[componentName].data.map((componentExample: any, index: number) => {
        return (
            <SiteCategoryItem key={index} slot={"canvas"}>
                <Component {...componentExample} />
            </SiteCategoryItem>
        );
    });
}

/* tslint:disable */
function render(): void {
    ReactDOM.render(
        <Site title={"FAST components base"}>
            <SiteCategory slot={"category"} name={"Components"}>
                {componentFactory()}
            </SiteCategory>
        </Site>,
        root
    );
}

render();
