export interface Point {
    x: number;
    y: number;
}

export class DefaultPoint implements Point {
    constructor(x?: number, y?: number) {
        if (x !== undefined) {
            this.x = x;
        }
        if (y !== undefined) {
            this.y = y;
        }

        this.equals = this.equals.bind(this);
        this.closeTo = this.closeTo.bind(this);
        this.clone = this.clone.bind(this);
    }

    public x: number = 0;
    public y: number = 0;

    public closeTo(rhs: Point, epsilon: number): boolean {
        return Math.abs(this.x - rhs.x) <= epsilon && Math.abs(this.y - rhs.y) <= epsilon;
    }

    public clone(): DefaultPoint {
        return new DefaultPoint(this.x, this.y);
    }

    public copyTo(target: Point): void {
        DefaultPoint.copy(this, target);
    }

    public equals(rhs: Point): boolean {
        return DefaultPoint.compare(this, rhs);
    }

    public static copy(source: Point, target: Point): void {
        target.x = source.x;
        target.y = source.y;
    }

    public static compare(lhs: Point, rhs: Point): boolean {
        return lhs.x === rhs.x && lhs.y === rhs.y;
    }
}
