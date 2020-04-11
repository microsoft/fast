import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Slider track item",
    description: "A slider track item component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/slider-track-item",
    formPluginId: "@microsoft/fast-components-react-base/slider-track-item",
    properties: {
        maxValuePositionBinding: {
            title: "Upper value position binding",
            type: "string",
            enum: [
                "selectedRangeMin",
                "selectedRangeMax",
                "totalRangeMin",
                "totalRangeMax",
                "constrainedRangeMin",
                "constrainedRangeMax",
            ],
        },
        minValuePositionBinding: {
            title: "Lower value position binding",
            type: "string",
            enum: [
                "selectedRangeMin",
                "selectedRangeMax",
                "totalRangeMin",
                "totalRangeMax",
                "constrainedRangeMin",
                "constrainedRangeMax",
            ],
        },
        children: {
            ...linkedDataSchema,
            formPluginId:
                "@microsoft/fast-components-react-base/slider-track-item/children",
        },
    },
};
