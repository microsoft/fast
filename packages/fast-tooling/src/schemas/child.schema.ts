import reactElementSchema from "./element.schema";
import reactTextSchema from "./text.schema";

export default {
    oneOf: [...reactElementSchema.oneOf, ...reactTextSchema.oneOf],
};
