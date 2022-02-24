import { DefaultTreeCommentNode } from "parse5";
import { Markup } from "@microsoft/fast-element";

const { marker } = Markup;
const blockMarker = new RegExp(`${marker}:\\d+`);
export function isMarkerComment(node: DefaultTreeCommentNode): boolean {
    return blockMarker.test(node.data);
}

const interpolationMarker = new RegExp(`${marker}\\{(?<id>\\d+)\\}${marker}`);
export function isInterpolationMarker(node: { value: string }): boolean {
    return interpolationMarker.test(node.value);
}

export function extractInterpolationMarkerId(node: { value: string }): number | null {
    const id = interpolationMarker.exec(node.value)?.groups?.id;

    return id === undefined ? null : parseInt(id, 10);
}
