import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {ISnapshotTestSuite} from "@microsoft/fast-jest-snapshots-react";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import Media, {IMediaHandledProps, IMediaMangedClasses, IMediaUnhandledProps} from "./media";

const examples: ISnapshotTestSuite<IMediaHandledProps & IMediaMangedClasses> = {
    name: "media",
    component: Media,
    data: [
        // {
        //     managedClasses: {
        //         media: "media"
        //     },
        //     mediaSrcSet: [
        //         {
        //             srcSet: "https://placehold.it/1399x600/2F2F2F/171717 1399w",
        //             minWidth: "1399px"
        //         },
        //         {
        //             srcSet: "https://placehold.it/1083x500/2F2F2F/171717 1083w",
        //             minWidth: "1083px"
        //         },
        //         {
        //             srcSet: "https://placehold.it/767x400/2F2F2F/171717 767w",
        //             minWidth: "767px"
        //         },
        //         {
        //             srcSet: "https://placehold.it/539x300/2F2F2F/171717 0w",
        //             minWidth: "0px",
        //         }

        //     ],
        //     src: "https://placehold.it/539x300/2F2F2F/171717",
        //     sizes: "100vw",
        //     alt: "Placeholder with grey background and dimension watermark without any imagery"
        // }
        {
            managedClasses: {
                media: "media"
            },
            mediaSrcSet: [
                {
                    srcSet: "https://placehold.it/1399x600/2F2F2F/171717",
                    minWidth: "1399px"
                },
                {
                    srcSet: "https://placehold.it/1083x500/2F2F2F/171717",
                    minWidth: "1083px"
                },
                {
                    srcSet: "https://placehold.it/767x400/2F2F2F/171717",
                    minWidth: "767px"
                },
                {
                    srcSet: "https://placehold.it/539x300/2F2F2F/171717",
                    minWidth: "0px",
                    maxWidth: "500px"
                }

            ],
            alt: "Placeholder with grey background and dimension watermark without any imagery"
        }
    ]
};

export default examples;