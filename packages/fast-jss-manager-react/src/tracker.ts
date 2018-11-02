import { JSSStyleSheet } from "./jss-manager";

/**
 * A simple class for tracking how many components are using any particular stylesheet
 */
class SheetTracker {
    public sheet: JSSStyleSheet;
    private _count: number = 0;

    constructor(sheet: JSSStyleSheet) {
        this.sheet = sheet;
        this.increment();
    }

    public increment(): number {
        this._count += 1;
        return this.count;
    }

    public decrement(): number {
        this._count -= 1;
        return this.count;
    }

    public get count(): number {
        return this._count;
    }
}

export { SheetTracker };
