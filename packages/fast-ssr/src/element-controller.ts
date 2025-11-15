import { ElementController } from "@microsoft/fast-element";

export class SSRElementController extends ElementController {
    disconnect(): void {
        super.disconnect();

        // remove all behaviors to avoid memory leak
        if (this.behaviors !== null) {
            for (const [behavior] of this.behaviors) {
                this.removeBehavior(behavior, true);
            }
        }
    }
}
