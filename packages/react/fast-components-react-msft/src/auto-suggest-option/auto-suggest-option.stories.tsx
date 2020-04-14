import { storiesOf } from "@storybook/react";
import React from "react";
import { uniqueId } from "lodash-es";
import { AutoSuggestOption } from "./";

storiesOf("Auto suggest option ", module)
    .add("Default", () => <AutoSuggestOption value={"Value"} id={uniqueId()} />)
    .add("Disabled", () => (
        <AutoSuggestOption value={"Disabled"} id={uniqueId()} disabled={true} />
    ));
