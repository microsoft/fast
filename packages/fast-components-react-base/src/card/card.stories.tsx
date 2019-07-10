import { storiesOf } from "@storybook/react";
import React from "react";
import Card from "./";
import Image from "../image";

storiesOf("Card", module).add("Default with children", () => (
    <Card>
        <Image src={"https://placehold.it/300x500/414141"} alt={"Placeholder image"} />
    </Card>
));
