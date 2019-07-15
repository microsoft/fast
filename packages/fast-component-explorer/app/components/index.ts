import { TestComponentViewConfig } from "./data.props";
import glyphSchema from "./glyph/glyph.schema";
import Glyph from "./glyph/glyph";
import groupSchema from "./group/group.schema";
import { Group } from "./group/group";

const glyph: TestComponentViewConfig = {
    schema: glyphSchema,
    component: Glyph,
};

const group: TestComponentViewConfig = {
    schema: groupSchema,
    component: Group,
};

export { glyph, group };
