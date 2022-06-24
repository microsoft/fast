import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Skeleton } from "../skeleton.js";
import { skeletonTemplate as template } from "../skeleton.template.js";

const styles = () => css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --skeleton-fill-default: #e1dfdd;
        --skeleton-fill: var(--skeleton-fill, var(--skeleton-fill-default));
        --skeleton-animation-gradient-default: linear-gradient(
            270deg,
            var(--skeleton-fill, var(--skeleton-fill-default)) 0%,
            #f3f2f1 51.13%,
            var(--skeleton-fill, var(--skeleton-fill-default)) 100%
        );
        --skeleton-animation-timing-default: ease-in-out;
        display: block;
        overflow: hidden;
        width: 100%;
        position: relative;
        background-color: var(--skeleton-fill, var(--skeleton-fill-default));
    }

    :host([shape="rect"]) {
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    :host([shape="circle"]) {
        border-radius: 100%;
        overflow: hidden;
    }

    object {
        height: auto;
        position: absolute;
        width: 100%;
        z-index: 2;
    }

    object img {
        height: auto;
        width: 100%;
    }

    .shimmer {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: var(
            --skeleton-animation-gradient,
            var(--skeleton-animation-gradient-default)
        );
        background-repeat: no-repeat;
        background-color: var(--skeleton-animation-fill, var(--neutral-fill-rest));
        animation: shimmer 2s infinite;
        animation-timing-function: var(
            --skeleton-animation-timing,
            var(--skeleton-animation-timing-default)
        );
        animation-direction: normal;
        z-index: 1;
    }

    ::slotted(svg) {
        z-index: 2;
    }

    ::slotted(.pattern) {
        width: 100%;
        height: 100%;
    }

    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Skeleton.compose({
            baseName: "skeleton",
            styles,
            template,
        })()
    );
