import * as React from "react";
import * as ReactDOM from "react-dom";
import Site, { ISiteProps, ICategoryProps } from "@microsoft/fast-development-site";
import * as examples from "./examples";

const items: ICategoryProps[] = [
    {
        name: "Fast Components",
        items: [
            examples.buttonExamples
        ]
    }
];

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        <Site title={"FAST components base"} categories={items} />,
        root
    );
}

render();
