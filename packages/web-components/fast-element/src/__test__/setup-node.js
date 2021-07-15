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
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
        return setTimeout(callback, 4);
    };
}
