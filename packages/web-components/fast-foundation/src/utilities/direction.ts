import { Direction } from "@microsoft/fast-web-utilities";

export const getDirection = (rootNode: HTMLElement): Direction => {
    const dirNode: HTMLElement | null = rootNode.parentElement!.closest("[dir]");
    return dirNode !== null && dirNode.dir === "rtl" ? Direction.rtl : Direction.ltr;
};
