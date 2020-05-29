import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const fastDesignSystemProviderId = "fast-design-system-provider";
export const fastDesignSystemProviderDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: fastDesignSystemProviderId,
            description: "The FAST design system provider element",
            attributes: [],
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
    ],
};
