import htmlElementSchema from "./react-html-element.schema.json";
import svgElementSchema from "./react-svg-element.schema.json";
import ReactHTMLElement from "./react-html-element";
import ReactSVGElement from "./react-svg-element";

export default [
    {
        name: "HTML Element",
        schema: htmlElementSchema,
        component: ReactHTMLElement,
    },
    {
        name: "SVG Element",
        schema: svgElementSchema,
        component: ReactSVGElement,
    },
];
