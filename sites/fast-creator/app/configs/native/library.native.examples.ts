import { nativeElementSchemas, textSchema } from "@microsoft/site-utilities";
import { longExampleText, shortExampleText } from "../constants";
import {
    divTag,
    heading1Tag,
    heading2Tag,
    heading3Tag,
    heading4Tag,
    heading5Tag,
    heading6Tag,
    imageTag,
    labelTag,
    paragraphTag,
    spanTag,
} from "./library.native.tags";

export const textExample = {
    schemaId: textSchema.$id,
    data: shortExampleText,
    dataLocation: "Slot",
};

export const imageExample = {
    schemaId: nativeElementSchemas[imageTag].id,
    data: {
        src: "https://via.placeholder.com/320x180",
    },
    dataLocation: "Slot",
};

export const heading1Example = {
    schemaId: nativeElementSchemas[heading1Tag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};

export const heading2Example = {
    schemaId: nativeElementSchemas[heading2Tag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};

export const heading3Example = {
    schemaId: nativeElementSchemas[heading3Tag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};

export const heading4Example = {
    schemaId: nativeElementSchemas[heading4Tag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};

export const heading5Example = {
    schemaId: nativeElementSchemas[heading5Tag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};

export const heading6Example = {
    schemaId: nativeElementSchemas[heading6Tag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};

export const paragraphExample = {
    schemaId: nativeElementSchemas[paragraphTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: longExampleText,
            dataLocation: "Slot",
        },
    ],
};

export const divExample = {
    schemaId: nativeElementSchemas[divTag].id,
    data: {},
    dataLocation: "Slot",
};

export const spanExample = {
    schemaId: nativeElementSchemas[spanTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};

export const labelExample = {
    schemaId: nativeElementSchemas[labelTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: shortExampleText,
            dataLocation: "Slot",
        },
    ],
};
