import { TestComponentViewConfig } from "./data.props";
import glyphSchema from "./glyph.schema";
import Glyph from "./glyph";
import reactHtmlElementSchema from "./react-html-element.schema";
import ReactHtmlElement from "./react-html-element";

const glyph: TestComponentViewConfig = {
    schema: glyphSchema,
    component: Glyph,
};

const reactHtmlElement: TestComponentViewConfig = {
    schema: reactHtmlElementSchema,
    component: ReactHtmlElement,
};

export { glyph, reactHtmlElement };
