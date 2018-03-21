import * as React from "react";
import * as ReactDOM from "react-dom";
import { DesignSystemProvider } from "@microsoft/fast-react-jss-manager";
import fluentDesignSystemDefaults from "../src/design-system";
import Site, { ISiteProps, ICategoryProps } from "@microsoft/fast-react-development-site";
import * as examples from "./examples";

const items: ICategoryProps[] = [
    {
        name: "Fast Components",
        items: [
            examples.ButtonExamples
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
        <div>
            <DesignSystemProvider designSystem={fluentDesignSystemDefaults}>
                <Site title={"FAST Microsoft components"} categories={items} />,
            </DesignSystemProvider>
        </div>,
        root
    );
}

render();
