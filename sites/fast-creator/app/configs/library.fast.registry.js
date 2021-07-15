import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@microsoft/fast-components";
export function registerFASTComponents() {
    DesignSystem.getOrCreate().register(
        Object.values(allComponents).map(component => {
            return component();
        })
    );
}
