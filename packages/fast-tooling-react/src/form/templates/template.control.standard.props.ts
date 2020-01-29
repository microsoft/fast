import {
    ControlConfig,
    ControlTemplateUtilitiesProps,
} from "./template.control.utilities.props";
import { ControlContext } from "./types";

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
