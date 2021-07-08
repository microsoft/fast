import { css, html } from "@microsoft/fast-element";
import { FASTElementLayout } from "@microsoft/fast-router";

export const pageLayout = new FASTElementLayout(
  html`
    <div class="container">
      <slot></slot>
    </div>
  `,
  css`
    .container {
      padding: 20px;
    }
  `
);