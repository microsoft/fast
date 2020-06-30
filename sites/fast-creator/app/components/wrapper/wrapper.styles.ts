import { css } from "@microsoft/fast-element";

const topLeft: string = ".tick:nth-child(1)";
const topRight: string = ".tick:nth-child(2)";
const rightTop: string = ".tick:nth-child(3)";
const rightBottom: string = ".tick:nth-child(4)";
const bottomRight: string = ".tick:nth-child(5)";
const bottomLeft: string = ".tick:nth-child(6)";
const leftBottom: string = ".tick:nth-child(7)";
const leftTop: string = ".tick:nth-child(8)";

export const WrapperStyles = css`
    .control {
        position: fixed;
        border: 1px solid #FB356D;
        box-sizing: border-box;
        pointer-events: none;
        opacity: 0;
    }

    .preselect {
        opacity: 0.2;
    }

    .control.preselect,
    .control.active {
        opacity: 1;
    }

    .tick {
        position: absolute;
        width: 0;
        height: 8px;
        border-left: 1px solid #FB356D;
        box-sizing: border-box;
    }

    ${rightTop},
    ${rightBottom},
    ${leftBottom},
    ${leftTop} {
        transform-origin: left top;
        transform: rotate(-90deg);
    }

    ${topLeft} {
        left: 0;
        top: -11px;
    }

    ${topRight} {
        right: 0;
        top: -11px;
    }

    ${rightTop} {
        right: -4px;
        top: 0;
    }

    ${rightBottom} {
        right: -4px;
        bottom: -9px;
    }

    ${bottomRight} {
        right: 0;
        bottom: -11px;
    }

    ${bottomLeft} {
        left: 0;
        bottom: -11px;
    }

    ${leftBottom} {
        left: -11px;
        bottom: -9px;
    }

    ${leftTop} {
        left: -11px;
        top: 0;
    }
`.withBehaviors();
