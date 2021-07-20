import { html, repeat } from "@microsoft/fast-element";
import { ElementDefinitionContext, Switch } from "@microsoft/fast-foundation";
import { CSSLayout } from "./css-layout";

/**
 * CSS flex-direction icons
 */
const flexDirectionRow = html`
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.13633 0.855846C6.87407 0.597433 6.452 0.600559 6.1936 0.862826C5.93513 1.1251 5.93827 1.5472 6.20053 1.80561L9.7808 5.3332H0.666667C0.298473 5.3332 0 5.63167 0 5.99987C0 6.36807 0.29848 6.66653 0.666667 6.66653H9.7764L6.20053 10.1898C5.93827 10.4482 5.93513 10.8703 6.1936 11.1326C6.452 11.3949 6.87407 11.398 7.13633 11.1396L11.7525 6.59133C12.0837 6.26493 12.0837 5.73053 11.7525 5.40413L7.13633 0.855846Z"
            fill="white"
        />
    </svg>
`;
const flexDirectionRowReverse = html`
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4.8636 11.1441C5.12586 11.4025 5.548 11.3994 5.8064 11.1371C6.0648 10.8749 6.06166 10.4528 5.7994 10.1943L2.21917 6.66674H11.3333C11.7015 6.66674 11.9999 6.36827 11.9999 6.00007C11.9999 5.63194 11.7015 5.33341 11.3333 5.33341H2.22357L5.7994 1.81017C6.06166 1.55176 6.0648 1.12966 5.8064 0.867393C5.548 0.60512 5.12586 0.601993 4.8636 0.860413L0.247478 5.40867C-0.0837949 5.73507 -0.0837949 6.26947 0.247478 6.59587L4.8636 11.1441Z"
            fill="white"
        />
    </svg>
`;
const flexDirectionColumn = html`
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M11.144 7.13633C11.4025 6.87407 11.3994 6.452 11.1371 6.19353C10.8748 5.93513 10.4527 5.93827 10.1943 6.20053L6.66676 9.78073V0.666667C6.66676 0.298473 6.36823 0 6.00009 0C5.63189 0 5.33343 0.29848 5.33343 0.666667V9.7764L1.8101 6.20053C1.55169 5.93827 1.12959 5.93513 0.867312 6.19353C0.605045 6.452 0.601919 6.87407 0.860332 7.13633L5.40856 11.7525C5.73503 12.0837 6.26936 12.0837 6.59583 11.7525L11.144 7.13633Z"
            fill="white"
        />
    </svg>
`;
const flexDirectionColumnReverse = html`
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M0.856089 4.86393C0.597676 5.12619 0.600803 5.54833 0.863076 5.80673C1.12534 6.06513 1.54744 6.06199 1.80586 5.79973L5.33342 2.21953V11.3336C5.33342 11.7018 5.63188 12.0003 6.00008 12.0003C6.36828 12.0003 6.66675 11.7018 6.66675 11.3336V2.22385L10.19 5.79973C10.4485 6.06199 10.8706 6.06513 11.1328 5.80673C11.3951 5.54833 11.3982 5.12619 11.1398 4.86393L6.59155 0.247801C6.26515 -0.083472 5.73075 -0.0834786 5.40435 0.247801L0.856089 4.86393Z"
            fill="white"
        />
    </svg>
`;

/**
 * CSS justify-content icons
 */
const justifyContentCenter = html`
    <svg
        width="12"
        height="14"
        viewBox="0 0 12 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.61553 0.230713H5.38477V13.7692H6.61553V0.230713ZM0.461426 4.30768C0.461426 3.75539 0.909141 3.30768 1.46143 3.30768H3.15373C3.70602 3.30768 4.15373 3.75539 4.15373 4.30768V9.69229C4.15373 10.2446 3.70602 10.6923 3.15373 10.6923H1.46143C0.909141 10.6923 0.461426 10.2446 0.461426 9.69229V4.30768ZM7.84619 4.30768C7.84619 3.75539 8.29391 3.30768 8.84619 3.30768H10.5385C11.0908 3.30768 11.5385 3.75539 11.5385 4.30768V9.69229C11.5385 10.2446 11.0908 10.6923 10.5385 10.6923H8.84619C8.29391 10.6923 7.84619 10.2446 7.84619 9.69229V4.30768Z"
            fill="white"
        />
    </svg>
`;
const justifyContentEnd = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            width="3.69231"
            height="7.38461"
            rx="1"
            transform="matrix(-1 0 0 1 9.23126 4.30768)"
            fill="white"
        />
        <path
            d="M14.1542 4.30768H11.4619C10.9096 4.30768 10.4619 4.75539 10.4619 5.30768V10.6923C10.4619 11.2446 10.9096 11.6923 11.4619 11.6923H14.1542V4.30768Z"
            fill="white"
        />
        <rect
            width="1.23077"
            height="13.5385"
            transform="matrix(-1 0 0 1 14.7687 1.23073)"
            fill="white"
        />
    </svg>
`;
const justifyContentStart = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="6.76874"
            y="4.30768"
            width="3.69231"
            height="7.38461"
            rx="1"
            fill="white"
        />
        <path
            d="M1.84583 4.30768H4.53813C5.09042 4.30768 5.53813 4.75539 5.53813 5.30768V10.6923C5.53813 11.2446 5.09042 11.6923 4.53813 11.6923H1.84583V4.30768Z"
            fill="white"
        />
        <rect x="1.23126" y="1.23073" width="1.23077" height="13.5385" fill="white" />
    </svg>
`;
const justifyContentSpaceAround = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="8.92307"
            y="4.30769"
            width="3.69231"
            height="7.38462"
            rx="1"
            fill="white"
        />
        <rect
            x="3.38461"
            y="4.30769"
            width="3.69231"
            height="7.38462"
            rx="1"
            fill="white"
        />
        <rect x="1.23077" y="1.23077" width="1.23077" height="13.5385" fill="white" />
        <rect x="13.5385" y="1.23077" width="1.23077" height="13.5385" fill="white" />
    </svg>
`;
const justifyContentSpaceBetween = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="9.84616"
            y="4.30769"
            width="3.69231"
            height="7.38462"
            rx="1"
            fill="white"
        />
        <rect
            x="2.46155"
            y="4.30769"
            width="3.69231"
            height="7.38462"
            rx="1"
            fill="white"
        />
        <rect x="1.23077" y="1.23077" width="1.23077" height="13.5385" fill="white" />
        <rect x="13.5385" y="1.23077" width="1.23077" height="13.5385" fill="white" />
    </svg>
`;
const justifyContentSpaceEvenly = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="8.61539"
            y="4.30769"
            width="3.69231"
            height="7.38462"
            rx="1"
            fill="white"
        />
        <rect
            x="3.69232"
            y="4.30769"
            width="3.69231"
            height="7.38462"
            rx="1"
            fill="white"
        />
        <rect x="1.23077" y="1.23077" width="1.23077" height="13.5385" fill="white" />
        <rect x="13.5385" y="1.23077" width="1.23077" height="13.5385" fill="white" />
    </svg>
`;

/**
 * CSS align-content icons
 */
const alignContentStretch = html`
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            width="10"
            height="6"
            rx="1"
            transform="matrix(-1 0 0 1 12 0)"
            fill="white"
        />
        <rect
            width="10"
            height="6"
            rx="1"
            transform="matrix(-1 0 0 1 12 8)"
            fill="white"
        />
        <rect x="3.05176e-05" y="13" width="14" height="1" fill="white" />
        <rect x="3.05176e-05" width="14" height="1" fill="white" />
    </svg>
`;
const alignContentSpaceEvenly = html`
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            width="10"
            height="3.5"
            rx="1"
            transform="matrix(-1 0 0 1 12 3)"
            fill="white"
        />
        <rect
            width="10"
            height="3.5"
            rx="1"
            transform="matrix(-1 0 0 1 12 7.5)"
            fill="white"
        />
        <rect x="3.05176e-05" y="13" width="14" height="1" fill="white" />
        <rect x="3.05176e-05" width="14" height="1" fill="white" />
    </svg>
`;
const alignContentSpaceBetween = html`
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 0H2V3C2 3.55228 2.44771 4 3 4H11C11.5523 4 12 3.55228 12 3V0Z"
            fill="white"
        />
        <path
            d="M12 11C12 10.4477 11.5523 10 11 10H3C2.44772 10 2 10.4477 2 11V14H12V11Z"
            fill="white"
        />
        <rect y="13" width="14" height="1" fill="white" />
        <rect width="14" height="1" fill="white" />
    </svg>
`;
const alignContentSpaceAround = html`
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            width="10"
            height="4"
            rx="1"
            transform="matrix(-1 0 0 1 12 2)"
            fill="white"
        />
        <rect
            width="10"
            height="4"
            rx="1"
            transform="matrix(-1 0 0 1 12 8)"
            fill="white"
        />
        <rect y="13" width="14" height="1" fill="white" />
        <rect width="14" height="1" fill="white" />
    </svg>
`;
const alignContentStart = html`
    <svg
        width="14"
        height="9"
        viewBox="0 0 14 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            width="10"
            height="4"
            rx="1"
            transform="matrix(1 0 0 -1 2 9)"
            fill="white"
        />
        <path
            d="M2 3C2 3.55228 2.44772 4 3 4L11 4C11.5523 4 12 3.55228 12 3V0L2 0L2 3Z"
            fill="white"
        />
        <rect
            x="14"
            y="1"
            width="14"
            height="1"
            transform="rotate(-180 14 1)"
            fill="white"
        />
    </svg>
`;
const alignContentEnd = html`
    <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            width="10"
            height="4"
            rx="1"
            transform="matrix(-1 0 0 1 12 0)"
            fill="white"
        />
        <path
            d="M12 6C12 5.44772 11.5523 5 11 5H3C2.44772 5 2 5.44772 2 6V9H12V6Z"
            fill="white"
        />
        <rect y="9" width="14" height="1" fill="white" />
    </svg>
`;
const alignContentCenter = html`
    <svg
        width="14"
        height="11"
        viewBox="0 0 14 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            width="10"
            height="4"
            rx="1"
            transform="matrix(-1 0 0 1 12 0)"
            fill="white"
        />
        <rect
            width="10"
            height="4"
            rx="1"
            transform="matrix(-1 0 0 1 12 7)"
            fill="white"
        />
        <rect y="5" width="14" height="1" fill="white" />
    </svg>
`;

/**
 * CSS align-items icons
 */
const alignItemsStretch = html`
    <svg
        width="14"
        height="12"
        viewBox="0 0 14 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="7.5" width="3.5" height="12" rx="1" fill="white" />
        <rect x="3" width="3.5" height="12" rx="1" fill="white" />
        <rect width="14" height="1" fill="white" />
        <rect y="11" width="14" height="1" fill="white" />
    </svg>
`;
const alignItemsStart = html`
    <svg
        width="14"
        height="12"
        viewBox="0 0 14 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="7.5" width="3.5" height="12" rx="1" fill="white" />
        <rect x="3" width="3.5" height="8" rx="1" fill="white" />
        <rect width="14" height="1" fill="white" />
    </svg>
`;
const alignItemsEnd = html`
    <svg
        width="14"
        height="12"
        viewBox="0 0 14 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="7.5" width="3.5" height="12" rx="1" fill="white" />
        <rect x="3" y="4" width="3.5" height="8" rx="1" fill="white" />
        <rect y="11" width="14" height="1" fill="white" />
    </svg>
`;
const alignItemsCenter = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="8.5" y="2" width="3.5" height="12" rx="1" fill="white" />
        <rect x="4" y="4" width="3.5" height="8" rx="1" fill="white" />
        <rect x="1" y="8" width="14" height="1" fill="white" />
    </svg>
`;

/**
 * CSS flex-wrap icons
 */
const flexWrapWrap = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="3" y="3" width="4" height="4" rx="1" fill="white" />
        <rect x="9.5" y="3.5" width="3" height="3" rx="0.5" stroke="white" />
        <rect x="3.5" y="9.5" width="3" height="3" rx="0.5" stroke="white" />
    </svg>
`;
const flexWrapWrapReverse = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="9" y="9" width="4" height="4" rx="1" fill="white" />
        <rect x="9.5" y="3.5" width="3" height="3" rx="0.5" stroke="white" />
        <rect x="3.5" y="9.5" width="3" height="3" rx="0.5" stroke="white" />
    </svg>
`;
const flexWrapNoWrap = html`
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="1" y="6" width="4" height="4" rx="1" fill="white" />
        <rect x="11.5" y="6.5" width="3" height="3" rx="0.5" stroke="white" />
        <rect x="6.5" y="6.5" width="3" height="3" rx="0.5" stroke="white" />
    </svg>
`;

/**
 * CSS wrap icons
 */
const rowGap = html`
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 0H12V1H0V0ZM2.76923 5H9.23077V7H2.76923V5ZM12 11H0V12H12V11Z"
            fill="white"
        />
    </svg>
`;
const columnGap = html`
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1 12L1 0H5.68249e-07L0 12H1ZM12 0L12 12H11L11 0H12ZM6.99998 2.76923V9.23077H4.99998L4.99998 2.76923H6.99998Z"
            fill="white"
        />
    </svg>
`;

/**
 * The template for the css-layout component.
 * @public
 */
export const cssLayoutTemplate = (context: ElementDefinitionContext) => html<CSSLayout>`
    <template>
        <div class="control-region">
            <${context.tagFor(Switch)} checked="${x => x.flexEnabled}" @change="${(
    x,
    c
) => x.handleToggleCSSLayout()}">
                Enable Flexbox
            </${context.tagFor(Switch)}>
        </div>
        <div class="flexbox-controls${x => (x.flexEnabled ? ` active` : "")}">
            <div class="control-region">
                <label for="fast-tooling-css-flex-direction">Direction</label>
                <div class="control-radio-region">
                    ${repeat(
                        x => x.flexDirectionOptions,
                        html<string, CSSLayout>`
                            <div
                                class="${(x, c) => c.parent.flexDirectionName} ${x =>
                                    x} ${(x, c) =>
                                    x === c.parent.flexDirectionValue ? "active" : ""}"
                            >
                                ${x =>
                                    x === "row"
                                        ? flexDirectionRow
                                        : x === "row-reverse"
                                        ? flexDirectionRowReverse
                                        : x === "column"
                                        ? flexDirectionColumn
                                        : flexDirectionColumnReverse}
                                <input
                                    type="radio"
                                    aria-label="${x => x}"
                                    name="${(x, c) => c.parent.flexDirectionName}"
                                    value="${x => x}"
                                    ?checked="${(x, c) =>
                                        c.parent.flexDirectionValue === x}"
                                    @change="${(x, c) =>
                                        c.parent.handleCSSChange(
                                            "flexDirectionValue",
                                            c.event
                                        )}"
                                />
                            </div>
                        `
                    )}
                </div>
            </div>
            <div class="control-region">
                <label for="fast-tooling-css-justify-content">Justify Content</label>
                <div class="control-radio-region">
                    ${repeat(
                        x => x.justifyContentOptions,
                        html<string, CSSLayout>`
                            <div
                                class="${(x, c) => c.parent.justifyContentName} ${x =>
                                    x} ${(x, c) =>
                                    x === c.parent.justifyContentValue ? "active" : ""}"
                            >
                                ${x =>
                                    x === "flex-start"
                                        ? justifyContentStart
                                        : x === "flex-end"
                                        ? justifyContentEnd
                                        : x === "center"
                                        ? justifyContentCenter
                                        : x === "space-around"
                                        ? justifyContentSpaceAround
                                        : x === "space-between"
                                        ? justifyContentSpaceBetween
                                        : justifyContentSpaceEvenly}
                                <input
                                    type="radio"
                                    aria-label="${x => x}"
                                    name="${(x, c) => c.parent.justifyContentName}"
                                    value="${x => x}"
                                    ?checked="${(x, c) =>
                                        c.parent.justifyContentValue === x}"
                                    @change="${(x, c) =>
                                        c.parent.handleCSSChange(
                                            "justifyContentValue",
                                            c.event
                                        )}"
                                />
                            </div>
                        `
                    )}
                </div>
            </div>
            <div class="control-region">
                <label for="fast-tooling-css-align-content">Align Content</label>
                <div class="control-radio-region">
                    ${repeat(
                        x => x.alignContentOptions,
                        html<string, CSSLayout>`
                            <div
                                class="${(x, c) => c.parent.alignContentName} ${x =>
                                    x} ${(x, c) =>
                                    x === c.parent.alignContentValue ? "active" : ""}"
                            >
                                ${x =>
                                    x === "flex-start"
                                        ? alignContentStart
                                        : x === "flex-end"
                                        ? alignContentEnd
                                        : x === "center"
                                        ? alignContentCenter
                                        : x === "space-around"
                                        ? alignContentSpaceAround
                                        : x === "space-between"
                                        ? alignContentSpaceBetween
                                        : x === "space-evenly"
                                        ? alignContentSpaceEvenly
                                        : alignContentStretch}
                                <input
                                    type="radio"
                                    aria-label="${x => x}"
                                    name="${(x, c) => c.parent.alignContentName}"
                                    value="${x => x}"
                                    ?checked="${(x, c) =>
                                        c.parent.alignContentValue === x}"
                                    @change="${(x, c) =>
                                        c.parent.handleCSSChange(
                                            "alignContentValue",
                                            c.event
                                        )}"
                                />
                            </div>
                        `
                    )}
                </div>
            </div>
            <div class="control-region">
                <label for="fast-tooling-css-align-items">Align Items</label>
                <div class="control-radio-region">
                    ${repeat(
                        x => x.alignItemsOptions,
                        html<string, CSSLayout>`
                            <div
                                class="${(x, c) => c.parent.alignItemsName} ${x => x} ${(
                                    x,
                                    c
                                ) => (x === c.parent.alignItemsValue ? "active" : "")}"
                            >
                                ${x =>
                                    x === "flex-start"
                                        ? alignItemsStart
                                        : x === "flex-end"
                                        ? alignItemsEnd
                                        : x === "center"
                                        ? alignItemsCenter
                                        : alignItemsStretch}
                                <input
                                    type="radio"
                                    aria-label="${x => x}"
                                    name="${(x, c) => c.parent.alignItemsName}"
                                    value="${x => x}"
                                    ?checked="${(x, c) => c.parent.alignItemsValue === x}"
                                    @change="${(x, c) =>
                                        c.parent.handleCSSChange(
                                            "alignItemsValue",
                                            c.event
                                        )}"
                                />
                            </div>
                        `
                    )}
                </div>
            </div>
            <div class="control-region row">
                <div class="control-numberfield-region">
                    <div>
                        <label for="fast-tooling-css-row-gap">Row gap</label>
                        <div class="numberfield-item">
                            <div class="icon">
                                ${rowGap}
                            </div>
                            <input
                                name="${x => x.rowGapName}"
                                class="css-row-gap"
                                type="number"
                                id="fast-tooling-css-row-gap"
                                value="${x => x.rowGapValue}"
                                @input="${(x, c) =>
                                    x.handleCSSChange("rowGapValue", c.event)}"
                            />
                        </div>
                    </div>
                    <div>
                        <label for="fast-tooling-css-column-gap">Column gap</label>
                        <div class="numberfield-item">
                            <div class="icon">
                                ${columnGap}
                            </div>
                            <input
                                name="${x => x.columnGapName}"
                                class="css-column-gap"
                                type="number"
                                id="fast-tooling-css-column-gap"
                                value="${x => x.columnGapValue}"
                                @input="${(x, c) =>
                                    x.handleCSSChange("columnGapValue", c.event)}"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="control-region">
                <label for="fast-tooling-css-flex-wrap">Wrap</label>
                <div class="control-radio-region">
                    ${repeat(
                        x => x.flexWrapOptions,
                        html<string, CSSLayout>`
                            <div
                                class="${(x, c) => c.parent.flexWrapName} ${x => x} ${(
                                    x,
                                    c
                                ) => (x === c.parent.flexWrapValue ? "active" : "")}"
                            >
                                ${x =>
                                    x === "wrap"
                                        ? flexWrapWrap
                                        : x === "wrap-reverse"
                                        ? flexWrapWrapReverse
                                        : flexWrapNoWrap}
                                <input
                                    type="radio"
                                    aria-label="${x => x}"
                                    name="${(x, c) => c.parent.flexWrapName}"
                                    value="${x => x}"
                                    ?checked="${(x, c) => c.parent.flexWrapValue === x}"
                                    @change="${(x, c) =>
                                        c.parent.handleCSSChange(
                                            "flexWrapValue",
                                            c.event
                                        )}"
                                />
                            </div>
                        `
                    )}
                </div>
            </div>
        </div>
    </template>
`;
