import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@microsoft/fast-components";
import { setupFASTComponentDesignSystem } from "./library.fast.design-system.mapping";

export function registerFASTComponents(): void {
    setupFASTComponentDesignSystem(document.body);

    DesignSystem.getOrCreate()
        .withPrefix("fast")
        .register(
            Object.values(allComponents).map((component: () => void) => {
                return component();
            })
        );
}
