import {
    AbstractControlTemplateProps,
    ControlConfig,
} from "./template.control.abstract.props";

export interface SingleLineControlTemplateProps extends AbstractControlTemplateProps {
    /**
     * This is the control interface that selects
     * the value to be updated in the UI
     */
    control: (config: ControlConfig) => void;
}
