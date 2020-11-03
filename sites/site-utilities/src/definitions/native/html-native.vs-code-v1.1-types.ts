export interface VSCodeNativeHTMLDefinition {
    version: number;
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
    valueSet?: string | undefined;
    description?: VSCodeNativeHTMLTagDescription | string;
}

export interface VSCodeNativeHTMLTagDescription {
    kind: string;
    value: string;
}

export interface VSCodeNativeHTMLReference {
    name: string,
    url: string
}

export interface VSCodeNativeHTMLTag {
    name: string;
    description?: VSCodeNativeHTMLTagDescription | string;
    attributes: VSCodeNativeHTMLAttribute[];
    references?: VSCodeNativeHTMLReference[];
}
