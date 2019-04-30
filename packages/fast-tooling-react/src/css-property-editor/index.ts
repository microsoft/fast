import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import PropertyEditor from "./property-editor";
import CSSPropertyEditorStyles, {
    CSSPropertyEditorClassNameContract,
} from "./property-editor.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CSSPropertyEditor = manageJss(CSSPropertyEditorStyles)(PropertyEditor);
type CSSPropertyEditor = InstanceType<typeof CSSPropertyEditor>;

export { CSSPropertyEditor };
export * from "./property-editor.props";
