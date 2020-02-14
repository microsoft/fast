import { customElement } from "@microsoft/fast-element";
import { DesignSystemProvider } from "./design-system-provider";
import { DesignSystemProviderTemplate } from "./design-system-provider.template";

@customElement({
    name: "fast-design-system-provider",
    template: DesignSystemProviderTemplate,
})
export class FASTDesignSystemProvider extends DesignSystemProvider {}
export * from "./design-system-provider.template";
export * from "./design-system-provider";
