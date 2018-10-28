import manageJss from "@microsoft/fast-jss-manager-react";
import { default as BaseSpan, SpanStyles } from "./span";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Span = manageJss(SpanStyles)(BaseSpan);
type Span = typeof Span;

export default Span;
export * from "./span";
