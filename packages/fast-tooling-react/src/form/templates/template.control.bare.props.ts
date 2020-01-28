import {
    ControlConfig,
    ControlTemplateUtilitiesProps,
} from "./template.control.utilities.props";

export interface BareControlTemplateProps extends ControlTemplateUtilitiesProps {
    /**
     * This is the control interface that selects
     * the value to be updated in the UI
     */
    control: (config: ControlConfig) => React.ReactNode;
}
