import type {
    CompiledViewBehaviorFactory,
    ViewBehaviorTargets,
} from "../templating/html-directive.js";

/**
 * Builds a detailed debug message for a hydration binding failure where a
 * factory's target node could not be found in the resolved targets.
 *
 * @param factory - The factory whose target node could not be located.
 * @param failureIndex - The zero-based index into the factories array at which failure occurred.
 * @param totalFactories - Total number of factories in the view.
 * @param targets - The targets that were successfully resolved before the failure.
 * @param hostName - The tag name of the host element.
 * @param templateString - String representation of the view's template.
 */
export function buildMissingBindingTargetMessage(
    factory: CompiledViewBehaviorFactory,
    failureIndex: number,
    totalFactories: number,
    targets: ViewBehaviorTargets,
    hostName: string,
    templateString: string,
): string {
    const resolvedTargetIds = Object.keys(targets);
    const resolvedCount = resolvedTargetIds.length;
    const factoryInfo = factory as any;

    const lines: string[] = [
        `Hydration binding error in <${hostName.toLowerCase()}>: could not locate a DOM target for the binding factory at index ${failureIndex} of ${totalFactories}.`,
        ``,
        `Progress: ${resolvedCount} of ${totalFactories} binding target(s) were resolved successfully before this error.`,
        `  Resolved target IDs: [${resolvedTargetIds.join(", ") || "none"}]`,
        ``,
        `Issue: Missing binding target (type: attribute or content binding mismatch)`,
        `  Expected target node ID : "${factory.targetNodeId}"`,
    ];

    if (factory.targetTagName) {
        lines.push(
            `  Expected element tag    : <${factory.targetTagName.toLowerCase()}>`,
        );
    }

    if (factoryInfo.sourceAspect) {
        lines.push(`  Binding aspect          : "${factoryInfo.sourceAspect}"`);
    }

    if (factoryInfo.aspectType !== undefined) {
        lines.push(`  Aspect type             : ${factoryInfo.aspectType}`);
    }

    lines.push(
        ``,
        `Possible causes:`,
        `  1. The server-rendered HTML does not match the client-side template`,
        `  2. Hydration markers are missing or were corrupted`,
        `  3. The DOM was modified before hydration completed`,
        ``,
        `Template (first 200 chars): ${templateString.slice(0, 200)}${templateString.length > 200 ? "..." : ""}`,
    );

    return lines.join("\n");
}

/**
 * Builds a detailed debug message for a hydration element targeting failure
 * where an element's attribute binding marker referenced a non-existent factory.
 *
 * @param node - The element whose attribute binding marker referenced a bad factory index.
 * @param factories - All compiled factories for the view.
 * @param markerIndex - The raw factory index read from the attribute marker.
 * @param hydrationIndexOffset - The offset applied to the marker index.
 * @param resolvedTargets - Targets successfully resolved before the failure.
 * @param hostName - The tag name of the host element.
 */
export function buildTargetElementErrorMessage(
    node: Element,
    factories: CompiledViewBehaviorFactory[],
    markerIndex: number,
    hydrationIndexOffset: number,
    resolvedTargets: ViewBehaviorTargets,
    hostName: string,
): string {
    const adjustedIndex = markerIndex + hydrationIndexOffset;
    const resolvedTargetIds = Object.keys(resolvedTargets);
    const resolvedCount = resolvedTargetIds.length;

    const lines: string[] = [
        `Hydration element targeting error on <${node.nodeName.toLowerCase()}> inside <${hostName.toLowerCase()}>.`,
        ``,
        `Progress: ${resolvedCount} target(s) were resolved successfully before this error.`,
        `  Resolved target IDs: [${resolvedTargetIds.join(", ") || "none"}]`,
        ``,
        `Issue: Attribute binding marker references factory index ${adjustedIndex} (marker value: ${markerIndex}, offset: ${hydrationIndexOffset}), but only ${factories.length} factory/factories exist (valid range: 0–${factories.length - 1}).`,
        ``,
        `This likely means the server-rendered HTML was produced with a different template`,
        `than the one currently being used for hydration (template/factory count mismatch).`,
    ];

    return lines.join("\n");
}

/**
 * Builds a detailed debug message for a hydration repeat marker mismatch where
 * the start marker found does not correspond to the expected repeat item index.
 *
 * @param hostName - The tag name of the host element.
 * @param expectedIndex - The repeat item index that was expected.
 * @param foundIndex - The repeat item index found in the start marker.
 */
export function buildRepeatMarkerMismatchMessage(
    hostName: string,
    expectedIndex: number,
    foundIndex: number | null,
): string {
    const lines: string[] = [
        `Hydration repeat marker mismatch inside <${hostName.toLowerCase()}>.`,
        ``,
        `Issue: The repeat start marker found does not match the expected repeat item index.`,
        `  Expected index : ${expectedIndex}`,
        `  Found index    : ${foundIndex !== null ? foundIndex : "unreadable (marker parse failed)"}`,
        ``,
        `This usually means:`,
        `  1. The server rendered a different number of items than the client template expects`,
        `  2. Repeat hydration markers were inserted out of order or are corrupted`,
    ];

    return lines.join("\n");
}
