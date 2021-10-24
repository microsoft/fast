import type { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { StartEndOptions } from "../patterns/start-end";
import { Radio } from "../radio/index";

/**
 * Rating item configuration options
 * @public
 */
export type RatingItemOptions = FoundationElementDefinition &
    StartEndOptions & {
        emptyIcon?: string | SyntheticViewTemplate;
        filledIcon?: string | SyntheticViewTemplate;
    };

export class RatingItem extends Radio {}
