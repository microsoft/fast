import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { AutoSuggestOption } from "./";
import { uniqueId } from "lodash-es";
import API from "./API.md";

storiesOf("Auto suggest option ", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => <AutoSuggestOption value={"Value"} id={uniqueId()} />)
    .add("Disabled", () => (
        <AutoSuggestOption value={"Disabled"} id={uniqueId()} disabled={true} />
    ));
