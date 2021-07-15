import { Wrapper } from "../components";
// Prevent tree shaking
Wrapper;
function updateWrapper(ref, element) {
    return () => {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        createWrapper(ref, element);
    };
}
function attachEventListeners(ref, element) {
    element.addEventListener("transitionstart", updateWrapper(ref, element));
    element.addEventListener("resize", updateWrapper(ref, element));
    element.addEventListener("transitionend", updateWrapper(ref, element));
}
function getWrapperAttributes(element) {
    const { x, y, width, height } = element.getBoundingClientRect();
    return {
        x,
        y,
        width,
        height,
    };
}
function createSelectedElementIndicator(ref, element, attributes) {
    if (!ref || !ref.current) {
        return;
    }
    const wrapper = document.createElement("creator-wrapper");
    Object.entries(attributes).forEach(([key, value]) => {
        wrapper.setAttribute(key, value.toString());
    });
    if (ref.current.lastChild) {
        ref.current.replaceChild(wrapper, ref.current.lastChild);
    }
    attachEventListeners(ref, element);
}
export function createWrapper(ref, element) {
    createSelectedElementIndicator(ref, element, getWrapperAttributes(element));
}
