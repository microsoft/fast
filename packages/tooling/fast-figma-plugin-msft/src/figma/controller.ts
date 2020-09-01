import { Controller } from "../core/controller";
import { PluginNodeData } from "../core/node";
import { PluginUIProps } from "../core/ui";
import { canHaveChildren, FigmaPluginNode, isInstanceNode } from "./node";

export class FigmaController extends Controller {
    private syncInstanceWithMaster(target: InstanceNode): void {
        const source = target.masterComponent;

        function sync(_source: BaseNode, _target: BaseNode): void {
            const pluginDataKeys: Array<keyof PluginNodeData> = [
                "recipes",
                "designSystem",
            ];
            pluginDataKeys.forEach((key: "recipes" | "designSystem") => {
                _target.setPluginData(key, _source.getPluginData(key));
            });

            if (canHaveChildren(_source) && canHaveChildren(_target)) {
                _source.children.forEach((child: any, index: number) => {
                    sync(child, _target.children[index]);
                });
            }
        }

        sync(source, target);

        // Invalidate the cache
        new FigmaPluginNode(target.id).invalidateDesignSystemCache();
    }

    public getNode(id: string): FigmaPluginNode | null {
        try {
            return new FigmaPluginNode(id);
        } catch (e) {
            return null;
        }
    }

    public syncNodes(ids: string[]): void {
        ids.map((id: string) => figma.getNodeById(id))
            .filter(isInstanceNode)
            .map(this.syncInstanceWithMaster);

        super.syncNodes(ids);
    }

    public setPluginUIState(message: PluginUIProps): void {
        figma.ui.postMessage(message);
    }
}
