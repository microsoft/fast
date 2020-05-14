import { html } from "@microsoft/fast-element";
import { Card } from "./card.js";

export const CardTemplate = html<Card>`<slot></slot>`;
