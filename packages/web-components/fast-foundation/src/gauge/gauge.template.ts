import { html, ref, ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { Gauge } from "./gauge";

/**
 * Template for a gauge
 * @param context - element definition context
 * @param definition - foundation element definition
 * @returns - view template
 * @public
 */
export const gaugeTemplate: FoundationElementTemplate<ViewTemplate<Gauge>> = (
    context,
    definition
) => html`
    <template title=${x => x.title ?? x.titleDisplay}>
        <svg>
            <circle
                class="meter"
                part="meter"
                ${ref("meterCircle")}
                cy="50%"
                cx="50%"
                pathLength="360"
            />
        </svg>
        <svg>
            <circle
                class="value"
                part="value"
                ${ref("valueCircle")}
                cy="50%"
                cx="50%"
                pathLength="360"
            />
        </svg>
        <slot class="face" part="face" ${ref("face")}>
            <div class="label" part="label">${x => x.label}</div>
            <div class="text" part="text">${x => x.displayedText}${x => x.units}</div>
        </slot>
    </template>
`;
