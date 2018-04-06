import * as React from "react";
import * as ReactDOM from "react-dom";
import { ICategoryProps } from "../src/components/site/category";
import Site, { ISiteProps } from "../src";

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
                    },
                    {
                        children: "foo"
                    },
                    {
                        children: "bar"
                    },
                    {
                        children: "bat"
                    },
                    {
                        children: "foo"
                    },
                    {
                        children: "bar"
                    },
                    {
                        children: "bat"
                    },
                    {
                        children: "foo"
                    },
                    {
                        children: "bar"
                    },
                    {
                        children: "bat"
                    },
                    {
                        children: "foo"
                    },
                    {
                        children: "bar"
                    },
                    {
                        children: "bat"
                    },
                    {
                        children: "foo"
                    },
                    {
                        children: "bar"
                    },
                    {
                        children: "bat"
                    },
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
                categoryItemComponentMinWidth: 400,
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
        <Site title={"FAST Development site test"} categories={items} />,
        document.getElementById("root")
    );
};

render();
