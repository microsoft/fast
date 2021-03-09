export interface IPoint {
    x: number;
    y: number;
  }
  
  export class Point implements IPoint {
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
  
    public closeTo(rhs: IPoint, epsilon: number): boolean {
      return Math.abs(this.x - rhs.x) <= epsilon && Math.abs(this.y - rhs.y) <= epsilon;
    }
  
    public clone(): Point {
      return new Point(this.x, this.y);
    }
  
    public copyTo(target: IPoint): void {
      Point.copy(this, target);
    }
  
    public equals(rhs: IPoint): boolean {
      return Point.compare(this, rhs);
    }
  
    public static copy(source: IPoint, target: IPoint): void {
      target.x = source.x;
      target.y = source.y;
    }
  
    public static compare(lhs: IPoint, rhs: IPoint): boolean {
      return lhs.x === rhs.x && lhs.y === rhs.y;
    }
  }
  