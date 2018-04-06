import * as React from "react";
import * as ReactDOM from "react-dom";
import Site, { ICategoryProps, ISiteProps } from "@microsoft/fast-development-site-react";
import * as examples from "./examples";

const items: ICategoryProps[] = [
    {
        name: "Fast Components",
        items: [
            examples.ButtonExamples,
            examples.DividerExamples,
            examples.MediaExamples
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
