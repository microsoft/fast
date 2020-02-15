import { customElement } from "@microsoft/fast-element";
import { DesignSystemProvider } from "./design-system-provider";
import { DesignSystemProviderTemplate } from "./design-system-provider.template";
import { DesignSystemProviderStyles } from "./design-system-provider.styles";

@customElement({
    name: "fast-design-system-provider",
    template: DesignSystemProviderTemplate,
    dependencies: [DesignSystemProviderStyles],
})
export class FASTDesignSystemProvider extends DesignSystemProvider {}
export * from "./design-system-provider.template";
export * from "./design-system-provider";
