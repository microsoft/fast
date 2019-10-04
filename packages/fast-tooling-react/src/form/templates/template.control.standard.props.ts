import {
    ControlConfig,
    ControlTemplateUtilitiesProps,
} from "./template.control.utilities.props";

/**
 * This is the context in which the control exists,
 * "default" places the control inset to align with
 * actions that appear on the right, "fill" stretches
 * the control to be the full width of the available space
 */
export enum ControlContext {
    default = "default",
    fill = "fill",
}

export interface StandardControlTemplateProps extends ControlTemplateUtilitiesProps {
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
