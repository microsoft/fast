// TODO: Remove this when we can export test utilities with types
// The import in the index.spec.tsx file throws due to the path and not being able to resolve types
declare module "@microsoft/fast-foundation/dist/esm/test-utilities/fixture" {
    export function uniqueElementName(): string;
}
