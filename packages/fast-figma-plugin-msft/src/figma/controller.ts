import { Controller } from "../core/controller";
import { FigmaPluginNode } from "./node";
import { PluginUIProps } from "../core/ui";

export class FigmaController extends Controller {
    public getNode(id: string): FigmaPluginNode | null {
        try {
            return new FigmaPluginNode(id);
        } catch (e) {
            return null;
        }
    }

    public setPluginUIState(message: PluginUIProps): void {
        figma.ui.postMessage(message);
    }
}
