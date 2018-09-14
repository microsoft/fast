import * as React from "react";
import Image, { IImageHandledProps, IImageManagedClasses, IImageUnhandledProps } from "./image";
import schema from "./image.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const classes: IImageManagedClasses = {
    managedClasses: {
        image: "image",
        image__picture: "picture",
        image_img: "img"
    }
};

const examples: IComponentFactoryExample<IImageHandledProps & IImageManagedClasses> = {
    name: "Image",
    component: Image,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...classes,
        vp1: "https://placehold.it/539x300/2F2F2F/171717",
        alt: "Placeholder with grey background and dimension watermark without any imagery"
    },
    data: [
        {
            ...classes,
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
