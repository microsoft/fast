import reactChildSchema from "./react-child.schema";

export default {
    oneOf: [
        ...reactChildSchema.oneOf,
        {
            type: "array",
            items: reactChildSchema,
        },
    ],
};
