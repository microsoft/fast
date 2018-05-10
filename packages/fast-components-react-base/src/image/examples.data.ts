import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Image, { IImageHandledProps, IImageMangedClasses, IImageUnhandledProps } from "./image";
import * as schema from "./image.schema.json";

const examples: ISnapshotTestSuite<IImageHandledProps & IImageMangedClasses> = {
    name: "image",
    component: Image,
    schema,
    data: [
        {
            managedClasses: {
                picture: "picture",
                image: "image",
                image_round: "image-round"
            },
            round: true,
            vp6: "https://placehold.it/2048x600/2F2F2F/171717",
            vp5: "https://placehold.it/1778x600/2F2F2F/171717",
            vp4: "https://placehold.it/1399x600/2F2F2F/171717",
            vp3: "https://placehold.it/1083x500/2F2F2F/171717",
            vp2: "https://placehold.it/767x400/2F2F2F/171717",
            vp1: "https://placehold.it/539x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        }
    ]
};

export default examples;
