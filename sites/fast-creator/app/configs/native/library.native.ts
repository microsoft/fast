import { nativeElementSchemas, textSchema } from "@microsoft/site-utilities";
import { NativeElementLibraryDefinition } from "../typings";
import {
    divExample,
    heading1Example,
    heading2Example,
    heading3Example,
    heading4Example,
    heading5Example,
    heading6Example,
    imageExample,
    labelExample,
    paragraphExample,
    spanExample,
    textExample,
} from "./library.native.examples";
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

export const nativeElementId = "native-elements";

export const nativeElementLibrary: NativeElementLibraryDefinition = {
    id: nativeElementId,
    displayName: "HTML Elements",
    optional: false,
    componentDictionary: {
        [textSchema.$id]: {
            displayName: textSchema.title,
            schema: textSchema,
            example: textExample,
        },
        [nativeElementSchemas[divTag].$id]: {
            displayName: nativeElementSchemas[divTag].title,
            schema: nativeElementSchemas[divTag],
            example: divExample,
        },
        [nativeElementSchemas[imageTag].$id]: {
            displayName: nativeElementSchemas[imageTag].title,
            schema: nativeElementSchemas[imageTag],
            example: imageExample,
        },
        [nativeElementSchemas[paragraphTag].$id]: {
            displayName: nativeElementSchemas[paragraphTag].title,
            schema: nativeElementSchemas[paragraphTag],
            example: paragraphExample,
        },
        [nativeElementSchemas[spanTag].$id]: {
            displayName: nativeElementSchemas[spanTag].title,
            schema: nativeElementSchemas[spanTag],
            example: spanExample,
        },
        [nativeElementSchemas[heading1Tag].$id]: {
            displayName: nativeElementSchemas[heading1Tag].title,
            schema: nativeElementSchemas[heading1Tag],
            example: heading1Example,
        },
        [nativeElementSchemas[heading2Tag].$id]: {
            displayName: nativeElementSchemas[heading2Tag].title,
            schema: nativeElementSchemas[heading2Tag],
            example: heading2Example,
        },
        [nativeElementSchemas[heading3Tag].$id]: {
            displayName: nativeElementSchemas[heading3Tag].title,
            schema: nativeElementSchemas[heading3Tag],
            example: heading3Example,
        },
        [nativeElementSchemas[heading4Tag].$id]: {
            displayName: nativeElementSchemas[heading4Tag].title,
            schema: nativeElementSchemas[heading4Tag],
            example: heading4Example,
        },
        [nativeElementSchemas[heading5Tag].$id]: {
            displayName: nativeElementSchemas[heading5Tag].title,
            schema: nativeElementSchemas[heading5Tag],
            example: heading5Example,
        },
        [nativeElementSchemas[heading6Tag].$id]: {
            displayName: nativeElementSchemas[heading6Tag].title,
            schema: nativeElementSchemas[heading6Tag],
            example: heading6Example,
        },
        [nativeElementSchemas[labelTag].$id]: {
            displayName: nativeElementSchemas[labelTag].title,
            schema: nativeElementSchemas[labelTag],
            example: labelExample,
        },
    },
};
