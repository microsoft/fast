import { storiesOf } from "@storybook/react";
import { uniqueId } from "lodash-es";
import React from "react";
import ListboxItem from "./";

storiesOf("Listbox item", module).add("Default", () => (
    <ListboxItem value={"default"} id={uniqueId()}>
        Default
    </ListboxItem>
));
