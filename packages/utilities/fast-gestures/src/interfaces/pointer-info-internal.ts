import { IPointerInfo } from "./pointer-info";

export interface IPointerInfoInternal extends IPointerInfo {
  /**
   * _previousPinchDistance: Internal, indicates the value of the previous distance between a primary and secondary pointer
   */
  _previousPinchDistance: number;
  /**
   * _previousRotationAngle: Internal, indicates the previous angle value in degrees between a primary and secondary pointer
   */
  _previousRotationAngle: number;
}
