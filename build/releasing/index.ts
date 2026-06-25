import { BeachballConfig } from "beachball";
import { renderEntry, renderHeader } from "./customRenderers";

export const config: BeachballConfig = {
    disallowedChangeTypes: ["major"],
    groups: [
        {
            name: "Microsoft FAST",
            include: [
                "packages/tooling/*",
                "packages/utilities/*",
                "packages/web-components/*",
            ],
            disallowedChangeTypes: ["major"],
        },
    ],
    changelog: {
        customRenderers: {
            renderHeader,
            renderEntry,
        },
    },
};
