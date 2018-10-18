import * as React from "react";
import { FormItemComponentMappingToProperyNamesProps, mappingName } from "./form-item";
import FormItemAlignHorizontal from "./form-item.align-horizontal";
import FormItemAlignVertical from "./form-item.align-vertical";
import FormItemFileUpload from "./form-item.file-upload";
import FormItemTheme from "./form-item.theme";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItem extends React.Component<FormItemComponentMappingToProperyNamesProps, {}> {
    public render(): JSX.Element {
        return <div>{this.renderCustomLayout()}</div>;
    }

    private renderCustomLayout(): JSX.Element {
        switch (this.props.name) {
            case mappingName.alignVertical:
                return <FormItemAlignVertical {...this.props} />;
            case mappingName.alignHorizontal:
                return <FormItemAlignHorizontal {...this.props} />;
            case mappingName.fileUpload:
                return <FormItemFileUpload {...this.props} />;
            case mappingName.theme:
                return <FormItemTheme {...this.props} />;
            default:
                return null;
        }
    }
}

export default FormItem;
