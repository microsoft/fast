import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Image from "./index";
import { IImageHandledProps } from "@microsoft/fast-components-react-base";
import * as schema from "@microsoft/fast-components-react-base/dist/image/image.schema.json";

export default {
    name: "image",
    component: Image,
    schema,
    data: [
        {
            round: true,
            src: "https://placehold.it/600x600/2F2F2F/171717",
            vp5: "https://placehold.it/600x600/2F2F2F/171717",
            vp4: "https://placehold.it/600x600/2F2F2F/171717",
            vp3: "https://placehold.it/500x500/2F2F2F/171717",
            vp2: "https://placehold.it/400x400/2F2F2F/171717",
            vp1: "https://placehold.it/300x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            round: true,
            src: "https://placehold.it/300x300/2F2F2F/171717",
            /* tslint:disable-next-line */
            srcSet: "https://placehold.it/600x600/2F2F2F/171717 2048w, https://placehold.it/600x600/2F2F2F/171717 1778w, https://placehold.it/1600x600/2F2F2F/171717 1399w, https://placehold.it/500x500/2F2F2F/171717 1083w, https://placehold.it/400x400/2F2F2F/171717 767w, https://placehold.it/300x300/2F2F2F/171717 0w",
            sizes: "100vw",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            round: true,
            src: "https://placehold.it/300x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            src: "https://placehold.it/600x600/2F2F2F/171717",
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
            srcSet: "https://placehold.it/2048x600/2F2F2F/171717 2048w, https://placehold.it/1778x600/2F2F2F/171717 1778w, https://placehold.it/1399x600/2F2F2F/171717 1399w, https://placehold.it/1083x500/2F2F2F/171717 1083w, https://placehold.it/767x400/2F2F2F/171717 767w, https://placehold.it/539x300/2F2F2F/171717 0w",
            sizes: "100vw",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
        {
            src: "https://placehold.it/539x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        },
    ]
} as ISnapshotTestSuite<IImageHandledProps>;
