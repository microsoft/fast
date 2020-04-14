import { storiesOf } from "@storybook/react";
import React from "react";
import { Image, ImageSlot } from "./";

storiesOf("Image", module)
    .add("Default", () => (
        <Image
            src="https://placehold.it/300x300/3E3E3E/171717"
            alt="Placeholder with grey background and dimension watermark without any imagery"
        />
    ))
    .add("With source elements", () => (
        <Image
            src="https://placehold.it/300x300/3E3E3E/171717"
            alt="Placeholder with grey background and dimension watermark without any imagery"
            children={[
                <source
                    key={"0"}
                    srcSet="https://placehold.it/450x450/2F2F2F/171717"
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
            ]}
        />
    ))
    .add("With srcSet attribute", () => (
        <Image
            src="https://placehold.it/300x300/3E3E3E/171717"
            alt="Placeholder with grey background and dimension watermark without any imagery"
            srcSet="https://placehold.it/500x500/2F2F2F/171717 1083w, https://placehold.it/400x400/2F2F2F/171717 767w, https://placehold.it/300x300/2F2F2F/171717 1w"
        />
    ));
