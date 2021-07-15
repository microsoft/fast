import React from "react";
import {
    AdditionalControlConfigOptions,
    ControlConfig,
    ControlTemplateUtilitiesProps,
    FormHTMLElement,
} from "./template.control.utilities.props";
import { OnChangeConfig } from "./types";
/**
 * Control template definition
 * This should be extended to create custom templates
 */
declare abstract class ControlTemplateUtilities<P, S> extends React.Component<
    P & ControlTemplateUtilitiesProps & AdditionalControlConfigOptions,
    S
> {
    ref: React.RefObject<FormHTMLElement>;
    private cache;
    componentDidMount(): void;
    componentDidUpdate(prevProps: P & ControlTemplateUtilitiesProps): void;
    renderSoftRemove(className: string): React.ReactNode;
    renderBadge(className: string): React.ReactNode;
    renderConstValueIndicator(className: string): React.ReactNode;
    /**
     * Renders an indicator that signifies that the value
     * displayed is a default value
     */
    renderDefaultValueIndicator(className: string): React.ReactNode;
    handleChange: (config: OnChangeConfig) => any;
    handleSetDefaultValue: () => void;
    handleSetConstValue: () => void;
    handleSoftRemove: () => void;
    /**
     * Renders an invalid message
     */
    renderInvalidMessage: (className: string) => React.ReactNode;
    /**
     * updates the validity
     */
    updateValidity: () => void;
    /**
     * Reports the current validity of the form item
     */
    reportValidity: () => void;
    getConfig(): ControlConfig;
    /**
     * Explicitly updates the default value as the value
     */
    handleUpdateValueToDefaultValue: () => void;
}
export default ControlTemplateUtilities;
