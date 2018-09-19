import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Image } from "./index";
import { IImageHandledProps, ImageSlot } from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/image/image.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Image",
    component: Image,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        src: "https://placehold.it/300x300/3E3E3E/171717",
        alt: "Placeholder with grey background and dimension watermark without any imagery"
    },
    data: [
        {
            src: "https://placehold.it/300x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery",
            children: [
                (<source srcSet="https://placehold.it/450x450/2F2F2F/171717" media="(min-width: 1400px)" slot={ImageSlot.source}/>),
                (<source srcSet="https://placehold.it/300x300/2F2F2F/171717" media="(min-width: 1084px)" slot={ImageSlot.source}/>),
                (<source srcSet="https://placehold.it/200x200/2F2F2F/171717" media="(min-width: 768px)" slot={ImageSlot.source}/>),
                (<source srcSet="https://placehold.it/100x100/2F2F2F/171717" media="(min-width: 540px)" slot={ImageSlot.source}/>),
                (<source srcSet="https://placehold.it/75x75/2F2F2F/171717" media="(min-width: 0px)"slot={ImageSlot.source}/>)
            ]
        },
        {
            src: "https://placehold.it/200x150/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            src: "https://placehold.it/300x300/2F2F2F/171717",
            /* tslint:disable-next-line */
            srcSet: "https://placehold.it/500x500/2F2F2F/171717 1083w, https://placehold.it/400x400/2F2F2F/171717 767w, https://placehold.it/300x300/2F2F2F/171717 1w",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        }
    ]
} as IComponentFactoryExample<IImageHandledProps>;
