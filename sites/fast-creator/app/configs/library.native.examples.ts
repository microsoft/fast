import { nativeElementSchemas } from "@microsoft/site-utilities";
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
} from "./library.native";
import { ExampleData } from "./typings";

export const nativeLinkedDataExamples: ExampleData = {
    [nativeElementSchemas[divTag].id]: [divExample],
    [nativeElementSchemas[imageTag].id]: [imageExample],
    [nativeElementSchemas[paragraphTag].id]: [paragraphExample],
    [nativeElementSchemas[spanTag].id]: [spanExample],
    [nativeElementSchemas[heading1Tag].id]: [heading1Example],
    [nativeElementSchemas[heading2Tag].id]: [heading2Example],
    [nativeElementSchemas[heading3Tag].id]: [heading3Example],
    [nativeElementSchemas[heading4Tag].id]: [heading4Example],
    [nativeElementSchemas[heading5Tag].id]: [heading5Example],
    [nativeElementSchemas[heading6Tag].id]: [heading6Example],
    [nativeElementSchemas[labelTag].id]: [labelExample],
};
