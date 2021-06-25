import { Card } from "@microsoft/fast-components";
import { ViewTemplate } from "@microsoft/fast-element";
import { FoundationElementDefinition } from "@microsoft/fast-foundation";

export type DemoCardDefinitionOptions = FoundationElementDefinition & {
    likeButton?: ViewTemplate;
};

export class DemoCard extends Card {}
