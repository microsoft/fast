import { css } from "@microsoft/fast-element";
import { accentFillRestBehavior } from "@microsoft/fast-components";

export const HTMLRenderLayerNavigationStyles = css`
    #navigationContainer {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
    }
    #clickDisplay,
    #hoverDisplay {
        display: none;
        position: absolute;
        box-sizing: content-box;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        pointer-events: none;
        margin: calc(var(--focus-outline-width) * -1px) 0 0
            calc(var(--focus-outline-width) * -1px);
    }
    #clickDisplay.active {
        display: block;
        border: calc(var(--focus-outline-width) * 1px) solid var(--accent-fill-rest);
    }
    #hoverDisplay.active {
        display: block;
    }
    #hoverDisplay.active:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.16;
        border: calc(var(--focus-outline-width) * 1px) solid var(--accent-fill-rest);
        background-color: var(--accent-fill-rest);
    }
    .pill {
        position: absolute;
        box-sizing: border-box;
        top: calc(
            (var(--type-ramp-minus-1-line-height) + (var(--focus-outline-width) * 4px)) *
                -1
        );
        line-height: var(--type-ramp-minus-1-line-height);
        border-radius: calc(var(--type-ramp-minus-1-line-height) / 2);
        background-color: var(--accent-fill-rest);
        padding: 0 calc(var(--design-unit) * 2px);
        border: calc(var(--focus-outline-width) * 1px) solid var(--accent-fill-rest);
        font-size: var(--type-ramp-minus-1-font-size);
        text-transform: uppercase;
        font-weight: 700;
        color: var(--background-color);
    }
    #hoverDisplay .pill {
        background-color: var(--background-color);
        color: var(--neutral-foreground-rest);
    }
`.withBehaviors(accentFillRestBehavior);
