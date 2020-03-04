import { customElement } from "@microsoft/fast-element";
import { DesignSystemProvider } from "./design-system-provider";
import { DesignSystemProviderTemplate as template } from "./design-system-provider.template";
import { DesignSystemProviderStyles as styles } from "./design-system-provider.styles";

@customElement({
    name: "fast-design-system-provider",
    template,
    styles,
})
export class FASTDesignSystemProvider extends DesignSystemProvider {}
export * from "./design-system-provider.template";
export * from "./design-system-provider";
export * from "./design-system-provider.styles";
