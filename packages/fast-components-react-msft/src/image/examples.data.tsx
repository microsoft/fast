import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Image from "./index";
import { IImageHandledProps } from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/image/image.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Image",
    component: Image,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        vp1: "https://placehold.it/300x300/3E3E3E/171717",
        alt: "Placeholder with grey background and dimension watermark without any imagery"
    },
    data: [
        {
            vp5: "https://placehold.it/600x600/2F2F2F/171717",
            vp4: "https://placehold.it/600x600/2F2F2F/171717",
            vp3: "https://placehold.it/500x500/2F2F2F/171717",
            vp2: "https://placehold.it/400x400/2F2F2F/171717",
            vp1: "https://placehold.it/300x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            src: "https://placehold.it/300x300/2F2F2F/171717",
            /* tslint:disable-next-line */
            srcSet: "https://placehold.it/600x600/2F2F2F/171717 2048w, https://placehold.it/600x600/2F2F2F/171717 1778w, https://placehold.it/1600x600/2F2F2F/171717 1399w, https://placehold.it/500x500/2F2F2F/171717 1083w, https://placehold.it/400x400/2F2F2F/171717 767w, https://placehold.it/300x300/2F2F2F/171717 1w",
            sizes: "100vw",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            src: "https://placehold.it/300x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            vp5: "https://placehold.it/600x600/2F2F2F/171717",
            vp4: "https://placehold.it/600x600/2F2F2F/171717",
            vp3: "https://placehold.it/500x500/2F2F2F/171717",
            vp2: "https://placehold.it/400x400/2F2F2F/171717",
            vp1: "https://placehold.it/300x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            src: "https://placehold.it/539x300/2F2F2F/171717",
            /* tslint:disable-next-line */
            srcSet: "https://placehold.it/2048x600/2F2F2F/171717 2048w, https://placehold.it/1778x600/2F2F2F/171717 1778w, https://placehold.it/1399x600/2F2F2F/171717 1399w, https://placehold.it/1083x500/2F2F2F/171717 1083w, https://placehold.it/767x400/2F2F2F/171717 767w, https://placehold.it/539x300/2F2F2F/171717 1w",
            sizes: "100vw",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            src: "https://placehold.it/539x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
    ]
} as IComponentFactoryExample<IImageHandledProps>;
