import { storiesOf } from "@storybook/react";
import React from "react";
import { Hypertext } from "../hypertext";

storiesOf("Hypertext", module)
    .add("With href", () => <Hypertext href="#">Hypertext</Hypertext>)
    .add("Without href", () => <Hypertext>Without href</Hypertext>);
