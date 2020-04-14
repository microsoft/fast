import React from "react";
import { storiesOf } from "@storybook/react";
import { uniqueId } from "lodash-es";
import TreeViewItem from "../tree-view-item";
import TreeView from "./";

const flatExample: React.ReactNode = [
    <TreeViewItem titleContent="Favorites Bar" key={uniqueId()} />,
    <TreeViewItem titleContent="Read later" key={uniqueId()} />,
    <TreeViewItem titleContent="Other Favs" key={uniqueId()} />,
];

const nestedExample: React.ReactNode = [
    <TreeViewItem
        titleContent="Favorites Bar"
        key={uniqueId()}
        children={[
            <TreeViewItem titleContent="Shopping" key={uniqueId()} />,
            <TreeViewItem
                titleContent="Sports"
                key={uniqueId()}
                selected={true}
                children={[
                    <TreeViewItem titleContent="Football" key={uniqueId()} />,
                    <TreeViewItem titleContent="Formula 1" key={uniqueId()} />,
                ]}
            />,
        ]}
    />,
    <TreeViewItem titleContent="Read later" key={uniqueId()} />,
    <TreeViewItem titleContent="Other Favs" key={uniqueId()} />,
];

storiesOf("Tree View", module)
    .add("Nested and Default Exanded", () => <TreeView children={nestedExample} />)
    .add("Flat Example", () => <TreeView children={flatExample} />);
