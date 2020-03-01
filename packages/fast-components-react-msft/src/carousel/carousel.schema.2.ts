import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Carousel",
    description: "A carousel component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/carousel",
    formPluginId: "@microsoft/fast-components-react-msft/carousel",
    properties: {
        label: {
            title: "Carousel accessible label",
            type: "string",
        },
        activeId: {
            title: "Set active slide by HTML id attribute",
            type: "string",
        },
        autoplay: {
            title: "Autoplay",
            type: "boolean",
        },
        autoplayInterval: {
            title: "Autoplay interval (in milliseconds)",
            type: "number",
            default: 6000,
        },
        items: {
            title: "Slides",
            type: "array",
            items: {
                title: "Slide",
                type: "object",
                properties: {
                    id: {
                        title: "HTML id attribute",
                        type: "string",
                    },
                    theme: {
                        title: "Theme",
                        type: "string",
                        enum: ["dark", "light"],
                    },
                    content: {
                        ...linkedDataSchema,
                        title: "Slide content",
                        formPluginId:
                            "@microsoft/fast-components-react-msft/carousel/items/content",
                        pluginId:
                            "@microsoft/fast-components-react-msft/carousel/items/content",
                    },
                },
                required: ["id"],
            },
        },
        loop: {
            title: "Loop",
            type: "boolean",
            default: true,
        },
    },
    required: ["content"],
};
