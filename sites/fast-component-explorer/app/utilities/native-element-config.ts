import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import { WebComponentDefinitionTag } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

import { imageDefinition, imageId } from "./image.definition";
const imageSchema = mapWebComponentDefinitionToJSONSchema(imageDefinition)[0];
export { imageDefinition, imageId, imageSchema };

import { labelDefinition, labelId } from "./label.definition";
const labelSchema = mapWebComponentDefinitionToJSONSchema(labelDefinition)[0];
export { labelDefinition, labelId, labelSchema };

export const nativeElementTags = [
    ...(imageDefinition.tags as WebComponentDefinitionTag[]),
    ...(labelDefinition.tags as WebComponentDefinitionTag[]),
];
