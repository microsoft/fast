import {
    Carousel,
    carouselSchema2,
    CarouselSlideTheme,
    imageSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/carousel/guidance";
import { ComponentViewConfig } from "./data.props";

const darkImage: object = {
    src: "http://placehold.it/1399x600/2F2F2F/171717",
    alt: "Placeholder image",
};

const lightImage: object = {
    src: "http://placehold.it/1399x600/DDD/222",
    alt: "Placeholder image",
};

const carouselConfig: ComponentViewConfig = {
    schema: carouselSchema2,
    component: Carousel,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: carouselSchema2.id,
                        data: {
                            label: "A carousel of items",
                            items: [
                                {
                                    content: [
                                        {
                                            id: "content0",
                                        },
                                    ],
                                    id: uniqueId(),
                                    theme: CarouselSlideTheme.dark,
                                },
                                {
                                    content: [
                                        {
                                            id: "content1",
                                        },
                                    ],
                                    id: uniqueId(),
                                    theme: CarouselSlideTheme.dark,
                                },
                                {
                                    content: [
                                        {
                                            id: "content2",
                                        },
                                    ],
                                    id: uniqueId(),
                                    theme: CarouselSlideTheme.light,
                                },
                                {
                                    content: [
                                        {
                                            id: "content3",
                                        },
                                    ],
                                    id: uniqueId(),
                                    theme: CarouselSlideTheme.dark,
                                },
                                {
                                    content: [
                                        {
                                            id: "content4",
                                        },
                                    ],
                                    id: uniqueId(),
                                    theme: CarouselSlideTheme.dark,
                                },
                            ],
                            autoplay: true,
                        },
                    },
                    content0: {
                        parent: {
                            id: "root",
                            dataLocation: "items[0].content",
                        },
                        schemaId: imageSchema.id,
                        data: lightImage,
                    },
                    content1: {
                        parent: {
                            id: "root",
                            dataLocation: "items[1].content",
                        },
                        schemaId: imageSchema.id,
                        data: darkImage,
                    },
                    content2: {
                        parent: {
                            id: "root",
                            dataLocation: "items[2].content",
                        },
                        schemaId: imageSchema.id,
                        data: lightImage,
                    },
                    content3: {
                        parent: {
                            id: "root",
                            dataLocation: "items[3].content",
                        },
                        schemaId: imageSchema.id,
                        data: darkImage,
                    },
                    content4: {
                        parent: {
                            id: "root",
                            dataLocation: "items[4].content",
                        },
                        schemaId: imageSchema.id,
                        data: lightImage,
                    },
                },
                "root",
            ],
        },
    ],
};

export default carouselConfig;
