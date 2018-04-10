import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Image from "./index";
import { IImageHandledProps } from "@microsoft/fast-components-react-base";

export default {
    name: "image",
    component: Image,
    data: [
        {
            round: true,
            src: "http://placehold.it/2048x600/2F2F2F/171717",
            vp5: "http://placehold.it/1778x600/2F2F2F/171717",
            vp4: "http://placehold.it/1399x600/2F2F2F/171717",
            vp3: "http://placehold.it/1083x500/2F2F2F/171717",
            vp2: "http://placehold.it/767x400/2F2F2F/171717",
            vp1: "http://placehold.it/539x300/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        }
    ]
} as ISnapshotTestSuite<IImageHandledProps>;
