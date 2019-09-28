import {
    AbstractControlTemplateProps,
    ControlConfig,
} from "./template.control.abstract.props";

export enum ControlContext {
    default = "default",
    fill = "fill",
}

export interface StandardControlTemplateProps extends AbstractControlTemplateProps {
    /**
     * This is the control interface that selects
     * the value to be updated in the UI
     */
    control: (config: ControlConfig) => React.ReactNode;

    /**
     * The context of the control, used for affecting
     * positioning and layout
     */
    context?: ControlContext;
}
