import { storiesOf } from "@storybook/react";
import React from "react";
import Image from "../image";
import Card from "./";

storiesOf("Card", module).add("Default with children", () => (
    <Card>
        <Image src={"https://placehold.it/300x500/414141"} alt={"Placeholder image"} />
    </Card>
));
