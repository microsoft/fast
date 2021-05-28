import { fillColor } from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";

export const styles = (context: ElementDefinitionContext) => css`
    ${display("block")} :host {
        background-color: ${fillColor};
    }
`;
