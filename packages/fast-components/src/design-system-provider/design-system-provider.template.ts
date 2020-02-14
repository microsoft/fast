import { html } from "@microsoft/fast-element";
import { DesignSystemProvider } from "./design-system-provider";

export const DesignSystemProviderTemplate = html<DesignSystemProvider>`
  <div class="header">
    <slot name="avatar"></slot>
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">
    <slot></slot>
  </div>

  <div class="footer"></div>
`;
