import * as React from "react";
import * as ReactDOM from "react-dom";
import Site, { ISiteProps, ICategoryProps } from "@microsoft/fast-development-site/dist";
import buttonExamples from "../src/button/examples.data";

const items: ICategoryProps[] = [
    {
        name: "Fast Components",
        items: [
            buttonExamples
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
