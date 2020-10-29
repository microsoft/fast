import { WebComponentDefinitionTag } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export interface VSCodeNativeHTMLDefinition {
    version: 1.1;
    tags: VSCodeNativeHTMLTag[];
}

export interface VSCodeNativeHTMLValueSetValue {
    name: string;
}

export interface VSCodeNativeHTMLValueSet {
    name: string;
    values: VSCodeNativeHTMLValueSetValue[];
}

export interface VSCodeNativeHTMLAttribute {
    name: string;
    valueSet: string;
}

export interface VSCodeNativeHTMLTagDescription {
    value: string;
}

export interface VSCodeNativeHTMLTag {
    name: string;
    description: VSCodeNativeHTMLTagDescription;
    attributes: VSCodeNativeHTMLAttribute[];
}
