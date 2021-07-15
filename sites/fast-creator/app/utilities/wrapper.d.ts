import React from "react";
export interface WrapperProps {
    activeElement: Element;
}
export interface WrapperState {
    mouseOver: boolean;
    x: number | null;
    y: number | null;
    width: number | null;
    height: number | null;
}
export declare function createWrapper(
    ref: React.RefObject<HTMLDivElement>,
    element: Element
): void;
