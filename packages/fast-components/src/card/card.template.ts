import { html } from "@microsoft/fast-element";
import { Card } from "./card";

export const CardTemplate = html<Card>`
  <div part="root">
    <slot></slot>
  </div>
`;
