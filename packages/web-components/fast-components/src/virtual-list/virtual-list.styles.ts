import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "@microsoft/fast-foundation";
export const virtualListStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
    .container {
        position: relative;
    }
`;
