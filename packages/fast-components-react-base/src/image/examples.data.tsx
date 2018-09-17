import * as React from "react";
import Image, { IImageHandledProps, IImageManagedClasses, IImageUnhandledProps, ImageSlot } from "./image";
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

const sourceElements: JSX.Element[] = [
    (<source srcSet="https://placehold.it/350x350/2F2F2F/171717" media="(min-width: 1400px)" slot={ImageSlot.source}/>),
    (<source srcSet="https://placehold.it/300x300/2F2F2F/171717" media="(min-width: 1084px)" slot={ImageSlot.source}/>),
    (<source srcSet="https://placehold.it/200x200/2F2F2F/171717" media="(min-width: 768px)" slot={ImageSlot.source}/>),
    (<source srcSet="https://placehold.it/100x100/2F2F2F/171717" media="(min-width: 540px)" slot={ImageSlot.source}/>),
    (<source srcSet="https://placehold.it/75x75/2F2F2F/171717" media="(min-width: 0px)"slot={ImageSlot.source}/>)
];

const examples: IComponentFactoryExample<IImageHandledProps & IImageManagedClasses> = {
    name: "Image",
    component: Image,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...classes,
        src: "https://placehold.it/539x300/2F2F2F/171717",
        alt: "Placeholder with grey background and dimension watermark without any imagery"
    },
    data: [
        {
            ...classes,
            src: "https://placehold.it/75x75/2F2F2F/171717",
            alt: "Placeholder with grey background and dimension watermark without any imagery",
            children: sourceElements
        }
    ]
};

export default examples;
