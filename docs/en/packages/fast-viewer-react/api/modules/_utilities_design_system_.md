[@microsoft/fast-viewer-react](../README.md) > ["utilities/design-system"](../modules/_utilities_design_system_.md)

# External module: "utilities/design-system"

## Index

### Interfaces

* [DesignSystem](../interfaces/_utilities_design_system_.designsystem.md)

### Variables

* [withDesignSystemDefaults](_utilities_design_system_.md#withdesignsystemdefaults)

---

## Variables

<a id="withdesignsystemdefaults"></a>

### `<Const>` withDesignSystemDefaults

**● withDesignSystemDefaults**: *`function`* =  memoize(
    (config: Partial<DesignSystem>): DesignSystem => {
        return Object.assign({}, designSystemDefaults, config);
    }
)

*Defined in [utilities/design-system.ts:18](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-viewer-react/src/utilities/design-system.ts#L18)*

Ensure that all properties of the design system are assigned

#### Type declaration
▸(config: *`Partial`<[DesignSystem](../interfaces/_utilities_design_system_.designsystem.md)>*): [DesignSystem](../interfaces/_utilities_design_system_.designsystem.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | `Partial`<[DesignSystem](../interfaces/_utilities_design_system_.designsystem.md)> |

**Returns:** [DesignSystem](../interfaces/_utilities_design_system_.designsystem.md)

___

