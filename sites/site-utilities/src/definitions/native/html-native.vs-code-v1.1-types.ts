export interface VSCodeNativeHTMLDefinition {
    version: 1.1;
    tags: VSCodeNativeHTMLTag[];
    globalAttributes: VSCodeNativeHTMLAttribute[];
    valueSets: VSCodeNativeHTMLValueSet[];
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
    /** Only making use of these 2 valueSets for now, see 'valueSets' in browsers.html-data.json for available list */
    valueSet?: "b" | "v" | string | undefined;
    description?: VSCodeNativeHTMLTagDescription | string;
}

export interface VSCodeNativeHTMLTagDescription {
    kind: string;
    value: string;
}

export interface VSCodeNativeHTMLReference {
    name: string;
    url: string;
}

export interface VSCodeNativeHTMLTag {
    name: string;
    description?: VSCodeNativeHTMLTagDescription | string;
    attributes: VSCodeNativeHTMLAttribute[];
    references?: VSCodeNativeHTMLReference[];
}
