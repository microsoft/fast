import { FoundationElement } from "@microsoft/fast-foundation";
import { Data } from "@microsoft/fast-tooling";

export interface ComponentLibraryConfig {
    displayName: string;
    examples: Data<unknown>;
    schema: JSON;
    component: FoundationElement;
}

export interface ExampleData {
    [key: string]: Array<Data<unknown>>;
}
