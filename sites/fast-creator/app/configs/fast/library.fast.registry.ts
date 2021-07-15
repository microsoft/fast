import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@microsoft/fast-components";

export function registerFASTComponents(): void {
    DesignSystem.getOrCreate().register(
        Object.values(allComponents).map((component: () => any) => {
            return component();
        })
    );
}
