import { TestComponentViewConfig } from "./data.props";
import glyphSchema from "./glyph/glyph.schema";
import Glyph from "./glyph/glyph";

const glyph: TestComponentViewConfig = {
    schema: glyphSchema,
    component: Glyph,
};

export { glyph };
