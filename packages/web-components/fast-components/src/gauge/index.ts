import { Gauge, gaugeTemplate as template } from "@microsoft/fast-foundation";
import { gaugeStyles as styles } from "./gauge.styles";

/**
 * The FAST Gauge element. Implements {@link @microsoft/fast-foundation#Gauge},
 * {@link @microsoft/fast-foundation#gaugeTemplate}
 *
 * @public
 * @remarks
 * HTML Element: \<fast-gauge\>
 */
export const fastGauge = Gauge.compose({
    baseName: "gauge",
    template,
    styles,
});

/**
 * Styles for fast-gauge
 * @public
 */
export const gaugeStyles = styles;

export { Gauge };
