import { linkedDataSchema } from "@microsoft/fast-tooling";
import designSystemSchema from "./design-system.schema";
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Design System Provider",
    description: "A design system provider schema definition.",
    id: "design-system-provider",
    type: "object",
    properties: {
        designSystem: {
            title: "Config",
            type: "object",
            properties: {
                direction: {
                    title: "Direction",
                    type: "string",
                    enum: ["ltr", "rtl"],
                    default: "ltr",
                },
                accentBaseColor: {
                    title: "Accent base color",
                    type: "string",
                    pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
                    default: "#0078D4",
                },
                ...designSystemSchema.properties,
            },
        },
        children: {
            title: "Children",
            ...linkedDataSchema,
        },
    },
};
