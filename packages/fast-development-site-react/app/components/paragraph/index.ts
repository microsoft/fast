import manageJss from "@microsoft/fast-jss-manager-react";
import { default as BaseParagraph, ParagraphStyles } from "./paragraph";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Paragraph = manageJss(ParagraphStyles)(BaseParagraph);
type Paragraph = typeof Paragraph;

export default Paragraph;
export * from "./paragraph";
