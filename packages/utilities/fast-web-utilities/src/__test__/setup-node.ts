/* eslint-disable */
if (window.document && !window.document.createRange) {
    window.document.createRange = () => ({
        setStart: () => {},
        setEnd: () => {},
        // @ts-ignore
        commonAncestorContainer: {
            nodeName: "BODY",
            ownerDocument: document,
        },
    });
}
