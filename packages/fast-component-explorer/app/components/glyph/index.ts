import { TestComponentViewConfig } from "../data.props";
import glyphSchema from "./glyph.schema";
import Glyph from "./glyph";
import { Icon } from "./glyph.props";

const glyph: TestComponentViewConfig = {
    schema: glyphSchema,
    component: Glyph,
};

export { glyph, glyphSchema, Icon };
export * from "./glyph";
