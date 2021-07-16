import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@microsoft/fast-components";
import { setupFASTComponentDesignSystem } from "./library.fast.design-system.mapping";

export function registerFASTComponents(): void {
    setupFASTComponentDesignSystem(document.body);

    DesignSystem.getOrCreate().register(
        Object.values(allComponents).map((component: (config: any) => any) => {
            return component({ prefix: "fast" });
        })
    );
}
