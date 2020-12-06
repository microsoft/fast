import { createElement } from "react";
import val from "@skatejs/val";

/**
 * Define the wrapped createElement function - this should be imported and
 * declared as the JSX pragma wherever Web Components are rendered by React
 */
export default val(createElement);
