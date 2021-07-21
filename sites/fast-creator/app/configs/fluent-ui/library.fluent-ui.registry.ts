import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@fluentui/web-components";
import { setupFluentUIComponentDesignSystem } from "./library.fluent-ui.design-system.mapping";

export function registerFluentUIComponents(): void {
    setupFluentUIComponentDesignSystem(document.body);

    DesignSystem.getOrCreate()
        .withPrefix("fluent")
        .register(
            Object.values(allComponents).map((component: () => void) => {
                return component();
            })
        );
}
