const style = `
    ::-webkit-scrollbar 
    {
        background: var(--fast-tooling-l1-color);
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-thumb 
    {
        background: var(--fast-tooling-l3-color);
        border-radius: 8px;
    }

    body, html 
    {
        font-size: 12px;
        margin: 0;
    }

    .preview
    {
        box-sizing: "border-box";
        display: "flex";
    }

    .preview__transparent
    {
        background:
            linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white;
        background-repeat: repeat, repeat;
        background-position: 0 0, 5px 5px;
        transform-origin: 0 0 0;
        background-origin: padding-box, padding-box;
        background-clip: border-box, border-box;
        background-size: 10px 10px, 10px 10px;
        box-shadow: none;
        text-shadow: none;
        min-height: 100vh;
        transition: none;
        transform: scaleX(1) scaleY(1) scaleZ(1);
    }

    .preview_componentRegion
    {
        padding: 12px;
        height: calc(100vh - 24px);
    }
`;

export default style;
