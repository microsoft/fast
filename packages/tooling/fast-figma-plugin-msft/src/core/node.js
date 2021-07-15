const DesignSystemCache = new Map();
/**
 * The abstract class the plugin controller interacts with
 * Implementation details of this class will need to be created
 * for each design tool.
 */
export class PluginNode {
    /**
     * Retrieves the contextual design system for the node
     */
    get designSystem() {
        // Retrun value from the cache if we have it
        if (DesignSystemCache.has(this.id)) {
            return DesignSystemCache.get(this.id);
        }
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        let node = this;
        const designSystems = [];
        while (node !== null) {
            designSystems.push(node.getPluginData("designSystem"));
            node = node.parent();
        }
        const designSystem = designSystems.reduceRight((prev, next) =>
            Object.assign(Object.assign({}, prev), next)
        );
        DesignSystemCache.set(this.id, designSystem);
        return designSystem;
    }
    get recipes() {
        const recipes = this.getPluginData("recipes");
        return recipes;
    }
    set recipes(recipes) {
        this.setPluginData("recipes", recipes);
    }
    /**
     * Returns all design system overrides applied to the node
     */
    get designSystemOverrides() {
        return this.getPluginData("designSystem");
    }
    /**
     * Set a property of the design system on this node
     * @param key - the design system property name
     * @param value - the design system property value
     */
    setDesignSystemProperty(key, value) {
        this.setPluginData(
            "designSystem",
            Object.assign(Object.assign({}, this.getPluginData("designSystem")), {
                [key]: value,
            })
        );
        this.invalidateDesignSystemCache();
    }
    /**
     * Remove a property from the design system on this node
     * @param key The key of the design system to remove
     */
    deleteDesignSystemProperty(key) {
        const data = this.getPluginData("designSystem");
        delete data[key];
        this.setPluginData("designSystem", data);
        this.invalidateDesignSystemCache();
    }
    /**
     * Delete entries in the design system cache for this node
     * and any child nodes
     */
    invalidateDesignSystemCache() {
        function getIds(node) {
            let found = [node.id];
            node.children().forEach(child => {
                found = found.concat(getIds(child));
            });
            return found;
        }
        getIds(this).forEach(id => DesignSystemCache.delete(id));
    }
}
