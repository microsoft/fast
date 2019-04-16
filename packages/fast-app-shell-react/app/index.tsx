import React from "react";
import ReactDOM from "react-dom";
import { AppShell, AppShellApp, AppShellColorModes } from "../src/app-shell";
import { Heading } from "@microsoft/fast-components-react-msft";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);
const testIcon: React.ReactElement<React.ReactSVGElement> = (
    <svg
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="1" y="1" width="7" height="7" rx="2" strokeWidth="2" />
        <rect x="11" y="1" width="7" height="7" rx="2" strokeWidth="2" />
        <rect x="11" y="11" width="7" height="7" rx="2" strokeWidth="2" />
        <rect x="1" y="11" width="7" height="7" rx="2" strokeWidth="2" />
    </svg>
);

const apps: AppShellApp[] = [
    {
        name: "test",
        id: "test-id",
        rootPath: "/foobar",
        render: (): JSX.Element => <Heading>Hello world!</Heading>,
        icon: testIcon,
    },
];

function render(): void {
    ReactDOM.render(<AppShell apps={apps} colorMode={AppShellColorModes.dark} />, root);
}

render();
