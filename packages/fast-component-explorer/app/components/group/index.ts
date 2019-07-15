import { TestComponentViewConfig } from "../data.props";
import groupSchema from "./group.schema";
import { Group } from "./group";

const group: TestComponentViewConfig = {
    schema: groupSchema,
    component: Group,
};

export { group, groupSchema };
export * from "./group";
