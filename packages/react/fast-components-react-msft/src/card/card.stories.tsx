import { storiesOf } from "@storybook/react";
import React from "react";
import { Image } from "../image";
import { Heading, HeadingSize, HeadingTag } from "../heading";
import { Card } from "./";

storiesOf("Card", module)
    .add("With image", () => (
        <Card>
            <Image src="https://placehold.it/300x300/414141" alt="Placeholder image" />
        </Card>
    ))
    .add("With heading and image", () => (
        <Card>
            <Heading tag={HeadingTag.h3} size={HeadingSize._4}>
                Heading
            </Heading>
            <Image src="https://placehold.it/300x300/414141" alt="Placeholder image" />
        </Card>
    ));
