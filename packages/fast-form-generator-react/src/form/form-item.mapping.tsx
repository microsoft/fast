import React from "react";
import { FormItemComponentMappingToProperyNamesProps, mappingName } from "./form-item";
import FormItemTextAlign from "./form-item.text-align";
import FormItemObjectAlign from "./form-item.object-align";
import FormItemFileUpload from "./form-item.file-upload";
import FormItemTheme from "./form-item.theme";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemMapping extends React.Component<
    FormItemComponentMappingToProperyNamesProps,
    {}
> {
    public static displayName: string = "FormItemMapping";

    public render(): JSX.Element {
        return <div>{this.renderCustomLayout()}</div>;
    }

    private renderCustomLayout(): JSX.Element {
        switch (this.props.name) {
            case mappingName.objectAlign:
                return <FormItemObjectAlign {...this.props} />;
            case mappingName.textAlign:
                return <FormItemTextAlign {...this.props} />;
            case mappingName.fileUpload:
                return <FormItemFileUpload {...this.props} />;
            case mappingName.theme:
                return <FormItemTheme {...this.props} />;
            default:
                return null;
        }
    }
}

export default FormItemMapping;
