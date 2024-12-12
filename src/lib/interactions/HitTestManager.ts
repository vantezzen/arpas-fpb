import { Matrix4, Vector3 } from "three";
import { XRHitTest, useXR } from "@react-three/xr";

export class HitTestManager {
  private matrixHelper = new Matrix4();
  private hitTestPosition = new Vector3();
  private lastHitResult: XRHitTestResult | null = null;

  onHitTestResults = (
    results: XRHitTestResult[],
    getWorldMatrix: (matrix: Matrix4, result: XRHitTestResult) => void
  ) => {
    if (results.length === 0) {
      this.lastHitResult = null;
      return;
    }

    this.lastHitResult = results[0];
    getWorldMatrix(this.matrixHelper, results[0]);
    this.hitTestPosition.setFromMatrixPosition(this.matrixHelper);
  };

  getHitPosition(): Vector3 | null {
    return this.lastHitResult ? this.hitTestPosition.clone() : null;
  }

  getLastHitResult() {
    return this.lastHitResult;
  }
}
