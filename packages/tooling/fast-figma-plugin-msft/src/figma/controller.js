import { Controller } from "../core/controller";
import { canHaveChildren, FigmaPluginNode, isInstanceNode } from "./node";
export class FigmaController extends Controller {
    syncInstanceWithMaster(target) {
        const source = target.masterComponent;
        function sync(_source, _target) {
            const pluginDataKeys = ["recipes", "designSystem"];
            pluginDataKeys.forEach(key => {
                _target.setPluginData(key, _source.getPluginData(key));
            });
            if (canHaveChildren(_source) && canHaveChildren(_target)) {
                _source.children.forEach((child, index) => {
                    sync(child, _target.children[index]);
                });
            }
        }
        sync(source, target);
        // Invalidate the cache
        new FigmaPluginNode(target.id).invalidateDesignSystemCache();
    }
    getNode(id) {
        try {
            return new FigmaPluginNode(id);
        } catch (e) {
            return null;
        }
    }
    syncNodes(ids) {
        ids.map(id => figma.getNodeById(id))
            .filter(isInstanceNode)
            .map(this.syncInstanceWithMaster);
        super.syncNodes(ids);
    }
    setPluginUIState(message) {
        figma.ui.postMessage(message);
    }
}
