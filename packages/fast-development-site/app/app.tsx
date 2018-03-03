import * as React from "react";
import * as ReactDOM from "react-dom";
import Site, { ISiteProps, ICategoryProps } from "../src";

import Button from "./components/button";
import Paragraph from "./components/paragraph";
import PolymerHeading from "./components/polymer-heading";

const items: ICategoryProps[] = [
    {
        name: "components",
        items: [
            {
                name: "button",
                component: Button,
                data: [
                    {
                        children: "foo"
                    },
                    {
                        children: "bar"
                    },
                    {
                        children: "bat"
                    }
                ]
            },
            {
                name: "paragraph",
                component: Paragraph,
                data: [{}, {}, {}, {}]
            },
            {
                name: "polymer-heading",
                component: PolymerHeading,
                type: "polymer",
                data: [
                    {
                        class: "foo",
                        children: "Heading 1"
                    },
                    {
                        class: "bar",
                        children: "Heading 2"
                    },
                    {
                        class: "bat",
                        children: "Heading 3"
                    }
                ]
            }
        ]
    }
];

const render: any = (): void => {
    ReactDOM.render(
        <Site categories={items} />,
        document.getElementById("root")
    );
};

render();
