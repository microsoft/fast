import { Controller } from "../core/controller";
import { PluginUIProps } from "../core/ui";
import { FigmaPluginNode } from "./node";
export declare class FigmaController extends Controller {
    private syncInstanceWithMaster;
    getNode(id: string): FigmaPluginNode | null;
    syncNodes(ids: string[]): void;
    setPluginUIState(message: PluginUIProps): void;
}
