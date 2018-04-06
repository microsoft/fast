import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {ISnapshotTestSuite} from "@microsoft/fast-jest-snapshots-react";
import {IManagedClasses} from "@microsoft/fast-jss-manager-react";
import Media from "./index";
import {IMediaHandledProps} from "@microsoft/fast-components-react-base";

export default {
    name: "media",
    component: Media,
    data: [
        {
            mediaSrcSet: [
                {
                    srcSet: "https://placehold.it/1399x600/2F2F2F/171717 1399w",
                    minWidth: "1399px"
                },
                {
                    srcSet: "https://placehold.it/1083x500/2F2F2F/171717 1083w",
                    minWidth: "1083px"
                },
                {
                    srcSet: "https://placehold.it/767x400/2F2F2F/171717 767w",
                    minWidth: "767px"
                },
                {
                    srcSet: "https://placehold.it/539x300/2F2F2F/171717 0w",
                    minWidth: "0px",
                }

            ],
            round: true,
            src: "https://placehold.it/539x300/2F2F2F/171717",
            sizes: "100vw",
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        }
    ]
} as ISnapshotTestSuite<IMediaHandledProps>;
