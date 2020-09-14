import { css } from "@microsoft/fast-element";
import { display } from '@microsoft/fast-foundation';
import { neutralOutlineRestBehavior } from '../../styles';

export const ListboxStyles = css`
    ${display("flex")} :host {
        border: calc(var(--outline-width) * 1px) solid ${neutralOutlineRestBehavior.var};
        flex-direction: column;
        background: var(--background-color);
        width: 100%;
        border-radius: calc(var(--corner-radius) * 1px);
    }
`.withBehaviors(
    neutralOutlineRestBehavior
);