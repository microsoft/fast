import { Controller } from "../core/controller";
import { FigmaPluginNode } from "./node";
import { PluginUIProps } from "../core/ui";

export class FigmaContoller extends Controller {
    public getNode(id: string): FigmaPluginNode | null {
        try {
            return new FigmaPluginNode(id);
        } catch (e) {
            return null;
        }
    }

    public setPluginUIState(message: PluginUIProps): void {
        console.log(message);
        figma.ui.postMessage(message);
    }

    public handleUIEvent(): void {
        console.log("Some shit happend");
    }
}
