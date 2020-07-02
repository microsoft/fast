import { css } from "@microsoft/fast-element";

export const CarouselSlideStyles = css`
    .outer-span {
        justify-content: center;
        width: 100%;
        height: 100%;
        align-items: flex-end;
        overflow: hidden;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        top: 0;
        bottom: 0;
        left: 0;
    }

    .inner-span {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: black;
        padding: 10px;
        border-radius: 5px;
        font-size: 24px;
    }

    img {
        max-width: 100%;
    }
`;
