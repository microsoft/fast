import reactElementSchema from "./react-element.schema";
import reactTextSchema from "./react-text.schema";

export default {
    oneOf: [...reactElementSchema.oneOf, ...reactTextSchema.oneOf],
};
