import { css } from "@microsoft/fast-element";

export const datePickerStyles = css`
    .flyout {
        width: 250px;
        height: 250px;
    }

    .time-picker {
        display: grid;
        grid-template-columns: 1fr auto 1fr 1fr;
        height: 100%;
    }

    .scroller {
        height: 100%;
        overflow: hidden;
    }

    .scroller:hover {
        overflow-y: overlay;
    }

    .listbox {
        width: 100%;
    }
`;
