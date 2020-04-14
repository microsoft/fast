import { storiesOf } from "@storybook/react";
import React from "react";
import Image, { ImageSlot } from "./";

const sourceElements: JSX.Element[] = [
    <source
        key={"0"}
        srcSet="https://placehold.it/350x350/2F2F2F/171717"
        media="(min-width: 1400px)"
        slot={ImageSlot.source}
    />,
    <source
        key={"1"}
        srcSet="https://placehold.it/300x300/2F2F2F/171717"
        media="(min-width: 1084px)"
        slot={ImageSlot.source}
    />,
    <source
        key={"2"}
        srcSet="https://placehold.it/200x200/2F2F2F/171717"
        media="(min-width: 768px)"
        slot={ImageSlot.source}
    />,
    <source
        key={"3"}
        srcSet="https://placehold.it/100x100/2F2F2F/171717"
        media="(min-width: 540px)"
        slot={ImageSlot.source}
    />,
    <source
        key={"4"}
        srcSet="https://placehold.it/75x75/2F2F2F/171717"
        media="(min-width: 0px)"
        slot={ImageSlot.source}
    />,
];

storiesOf("Image", module)
    .add("Default", () => (
        <Image
            src={"https://placehold.it/400x400"}
            alt={"Placeholder with grey background and dimension watermark"}
        />
    ))
    .add("With source elements", () => (
        <Image
            src={"https://placehold.it/75x75/2F2F2F/171717"}
            alt={"Placeholder with grey background and dimension watermark"}
        >
            {sourceElements}
        </Image>
    ));
