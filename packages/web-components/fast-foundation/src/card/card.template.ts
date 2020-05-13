import { html } from "@microsoft/fast-element";
import { Card } from "./card";

export const CardTemplate = html<Card>`<slot></slot>`;
