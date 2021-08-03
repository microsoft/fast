import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@microsoft/fast-components";
import { spinalCase } from "@microsoft/fast-web-utilities";
import { setupFASTComponentDesignSystem } from "./library.fast.design-system.mapping";

function getAllFastTagNames(): string {
    return Object.keys(allComponents).reduce(
        (previousValue: string, componentName: string) => {
            return `${previousValue ? `${previousValue}, ` : ""}${spinalCase(
                componentName
            )}`;
        },
        ""
    );
}

export function registerFASTComponents(): void {
    setupFASTComponentDesignSystem(document.body, getAllFastTagNames);

    DesignSystem.getOrCreate()
        .withPrefix("fast")
        .register(
            Object.values(allComponents).map((component: () => void) => {
                return component();
            })
        );
}
