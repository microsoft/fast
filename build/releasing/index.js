import { renderEntry, renderHeader } from "./customRenderers";
export const config = {
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
