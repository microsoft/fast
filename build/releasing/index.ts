import { BeachballConfig } from "beachball";
import { renderEntry, renderHeader } from "./customRenderers";

export const config: BeachballConfig = {
    disallowedChangeTypes: ["major"],
    groups: [
        {
            name: "Microsoft FAST",
            include: ["packages/utilities/*", "packages/web-components/*"],
            exclude: ["packages/tooling/*"],
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
