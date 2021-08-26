/**
 * This is the config passed to as CSSControl plugin override.
 */
export interface CSSControlConfig {
    /**
     * All CSS currently being held in state in the CSSControl
     */
    css: { [key: string]: string };

    /**
     * A call back used to update the css
     */
    onChange: (css: { [key: string]: string }) => void;

    /**
     * The value
     */
    value: string;
}

/**
 * The props for the CSS template
 */
export interface CSSStandardControlTemplateProps extends CSSControlConfig {
    /**
     * The control provided.
     */
    control: (config: CSSControlConfig) => React.ReactNode;
}
