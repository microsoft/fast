[@microsoft/fast-tooling-react](../README.md) > ["style/design-system"](../modules/_style_design_system_.md)

# External module: "style/design-system"

## Index

### Interfaces

* [DesignSystem](../interfaces/_style_design_system_.designsystem.md)

### Variables

* [withDesignSystemDefaults](_style_design_system_.md#withdesignsystemdefaults)

---

## Variables

<a id="withdesignsystemdefaults"></a>

### `<Const>` withDesignSystemDefaults

**● withDesignSystemDefaults**: *`function`* =  memoize(
    (config: Partial<DesignSystem>): DesignSystem =>
        withDefaults(designSystemDefaults)(config)
)

*Defined in [style/design-system.ts:19](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-tooling-react/src/style/design-system.ts#L19)*

Ensure that all properties of the design system are assigned

#### Type declaration
▸(config: *`Partial`<[DesignSystem](../interfaces/_style_design_system_.designsystem.md)>*): [DesignSystem](../interfaces/_style_design_system_.designsystem.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | `Partial`<[DesignSystem](../interfaces/_style_design_system_.designsystem.md)> |

**Returns:** [DesignSystem](../interfaces/_style_design_system_.designsystem.md)

___

