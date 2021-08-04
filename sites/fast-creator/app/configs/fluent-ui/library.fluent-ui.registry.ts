import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@fluentui/web-components";
import { spinalCase } from "@microsoft/fast-web-utilities";
import { setupFluentUIComponentDesignSystem } from "./library.fluent-ui.design-system.mapping";

function getAllFluentComponentTags(containingSelector?: string): string {
    if (containingSelector) {
        return `${Object.keys(allComponents).reduce(
            (previousValue: string, componentName: string) => {
                return `${
                    previousValue ? `${previousValue}, ` : ""
                }${containingSelector} ${spinalCase(componentName)}`;
            },
            ""
        )}`;
    }

    return Object.keys(allComponents).reduce(
        (previousValue: string, componentName: string) => {
            return `${previousValue ? `${previousValue}, ` : ""}${spinalCase(
                componentName
            )}`;
        },
        ""
    );
}

export function registerFluentUIComponents(): void {
    setupFluentUIComponentDesignSystem(document.body, getAllFluentComponentTags);

    DesignSystem.getOrCreate()
        .withPrefix("fluent")
        .register(
            Object.values(allComponents).map((component: () => void) => {
                return component();
            })
        );
}
