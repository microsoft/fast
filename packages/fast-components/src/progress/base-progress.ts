import { attr, FastElement } from "@microsoft/fast-element";

export class BaseProgress extends FastElement {
    @attr
    public value: number;

    @attr
    public min: number;

    @attr
    public max: number;

    @attr
    public paused: boolean;
}
