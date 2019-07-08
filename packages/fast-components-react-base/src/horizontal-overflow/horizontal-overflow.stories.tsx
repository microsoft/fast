import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import HorizontalOverflow from "./";
import Button from "../button";
import Image from "../image";
import { action } from "@storybook/addon-actions";

const images: JSX.Element[] = [
    "https://placehold.it/120x100/414141/?text=1",
    "https://placehold.it/180x100?text=2",
    "https://placehold.it/240x100/414141/?text=3",
    "https://placehold.it/120x100?text=4",
    "https://placehold.it/140x100/414141/?text=5",
    "https://placehold.it/200x100?text=6",
    "https://placehold.it/220x100/414141/?text=7",
    "https://placehold.it/170x100?text=8",
    "https://placehold.it/160x100/414141/?text=9",
    "https://placehold.it/240x100?text=10",
    "https://placehold.it/110x100/414141/?text=11",
    "https://placehold.it/270x100?text=12",
].map(
    (src: string): JSX.Element => {
        return <Image src={src} key={src} alt="Placeholder image" />;
    }
);

storiesOf("Horizontal overflow", module)
    .add("Default", () => (
        <HorizontalOverflow
            onScrollChange={action("onScrollChange")}
            onOverflowChange={action("onOverflowChange")}
        >
            <Button slot="previous">Previous</Button>
            <Button slot="next">Next</Button>
            {images}
        </HorizontalOverflow>
    ))
    .add("Custom scroll duration", () => (
        <HorizontalOverflow
            onScrollChange={action("onScrollChange")}
            onOverflowChange={action("onOverflowChange")}
            scrollDuration={5000}
        >
            <Button slot="previous">Previous</Button>
            <Button slot="next">Next</Button>
            {images}
        </HorizontalOverflow>
    ));
