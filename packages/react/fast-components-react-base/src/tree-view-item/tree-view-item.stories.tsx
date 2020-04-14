import React from "react";
import { storiesOf } from "@storybook/react";
import TreeViewItem from "./";

storiesOf("Tree View Item", module)
    .add("Title Only", () => <TreeViewItem titleContent="Favorites" />)
    .add("Selected", () => <TreeViewItem titleContent="Favorites" selected={true} />);
