# DesignToken vNext
## Major API Changes
1. Tokens may only be set for FAST elements
2. Removal of connection-based APIs added to help work with native elements
3. Addition of a readonly 'default' property (this could potentially be a getter / setter, deprecate .withDefault()?)
4. Addition of a resolution strategy plugin to facilitate SSR token resolution using events

## Architectural Changes
- Divorce DesignTokenNode from DOM implementation. It should exist as a stand-alone node tree. It should do all resolutions from an internally managed graph, notifying when tokens change for nodes.
- Where FASTElement instances are mapped to nodes. Changes for that node are emitted to CSS custom properties if applicable.
- Remove core dependency on Observable for Design Token values. We'll still need to evaluate functions as binding observers to allow re-evaluation when observable changes, but tokens themselves will not emit observable changes.
    - We'll need to collect the tokens retrieved during each callback and associate them to a value similar to how observable does it. Then when a dependency changes, the value can be re-evaluated and the associated token can emit a change if it is different.
- Use direct node references for parent and child relationships. Using a map is significantly slower: https://jsbench.me/onl31wsw32/1

```ts
type Token<T> = Symbol;

interface Node {
    appendChild(node: Node): void;
    removeChild(node: Node): void;
    readonly children: Node[];
    readonly parent: Node;
    set<T>(token: Token<T>, value: T): void;
    has(token): boolean;
    get<T>(token: Token<T>): T | undefined;
}
```