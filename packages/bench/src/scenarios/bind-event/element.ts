import { attr, FASTElement } from "@microsoft/fast-element";

export class BenchElement extends FASTElement {
    @attr count: string = "0";

    handleClick(): void {
        this.count = String(parseInt(this.count, 10) + 1);
    }
}
