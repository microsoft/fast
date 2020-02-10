import { storiesOf } from "@storybook/react";
import React from "react";
import Toolbar from "./";

storiesOf("Toolbar", module)
    .add("Default", () => (
        <Toolbar>
            <button role="button">Item 1</button>
            <button role="button">Item 2</button>
            <button role="button">Item 3</button>
        </Toolbar>
    ))
    .add("Ignore elements without proper role set", () => (
        <Toolbar>
            <button role="button">Item 1</button>
            <button>Button without a role</button>
            <button role="button">Item 3</button>
        </Toolbar>
    ))
    .add("Ignore disabled elements", () => (
        <Toolbar allowFocusOnDisabledItems={false}>
            <button role="button">Item 1</button>
            <button role="button" aria-disabled="true">
                Disabled
            </button>
            <button role="button">Item 3</button>
        </Toolbar>
    ))
    .add("Autofocus", () => (
        <Toolbar initialFocusIndex={1} enableAutoFocus={true}>
            <button role="button">Item 1</button>
            <button role="button">initial focus</button>
            <button role="button">Item 3</button>
        </Toolbar>
    ));
