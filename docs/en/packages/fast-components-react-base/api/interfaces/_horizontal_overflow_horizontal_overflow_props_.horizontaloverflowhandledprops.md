[@microsoft/fast-components-react-base](../README.md) > ["horizontal-overflow/horizontal-overflow.props"](../modules/_horizontal_overflow_horizontal_overflow_props_.md) > [HorizontalOverflowHandledProps](../interfaces/_horizontal_overflow_horizontal_overflow_props_.horizontaloverflowhandledprops.md)

# Interface: HorizontalOverflowHandledProps

## Hierarchy

↳  [HorizontalOverflowManagedClasses](_horizontal_overflow_horizontal_overflow_props_.horizontaloverflowmanagedclasses.md)

**↳ HorizontalOverflowHandledProps**

## Index

### Properties

* [children](_horizontal_overflow_horizontal_overflow_props_.horizontaloverflowhandledprops.md#children)
* [managedClasses](_horizontal_overflow_horizontal_overflow_props_.horizontaloverflowhandledprops.md#managedclasses)
* [onOverflowChange](_horizontal_overflow_horizontal_overflow_props_.horizontaloverflowhandledprops.md#onoverflowchange)
* [onScrollChange](_horizontal_overflow_horizontal_overflow_props_.horizontaloverflowhandledprops.md#onscrollchange)
* [scrollDuration](_horizontal_overflow_horizontal_overflow_props_.horizontaloverflowhandledprops.md#scrollduration)

---

## Properties

<a id="children"></a>

### `<Optional>` children

**● children**: *`React.ReactNode` \| `React.ReactNode`[]*

*Defined in [horizontal-overflow/horizontal-overflow.props.ts:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/horizontal-overflow/horizontal-overflow.props.ts#L46)*

The horizontal overflow content

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-components-react-base/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___
<a id="onoverflowchange"></a>

### `<Optional>` onOverflowChange

**● onOverflowChange**: *`function`*

*Defined in [horizontal-overflow/horizontal-overflow.props.ts:57](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/horizontal-overflow/horizontal-overflow.props.ts#L57)*

Callback for on overflow change Use `onOverflowChange` to know if there are enough items to cause overflow, and where the overflow occurs

#### Type declaration
▸(overflowObject: *[OverflowChange](_horizontal_overflow_horizontal_overflow_props_.overflowchange.md)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| overflowObject | [OverflowChange](_horizontal_overflow_horizontal_overflow_props_.overflowchange.md) |

**Returns:** `void`

___
<a id="onscrollchange"></a>

### `<Optional>` onScrollChange

**● onScrollChange**: *`function`*

*Defined in [horizontal-overflow/horizontal-overflow.props.ts:63](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/horizontal-overflow/horizontal-overflow.props.ts#L63)*

Callback for on scroll change Use `onScrollChange` to receive if scroll is at the start or end of the overflow set

#### Type declaration
▸(scrollObject: *[PositionChange](_horizontal_overflow_horizontal_overflow_props_.positionchange.md)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| scrollObject | [PositionChange](_horizontal_overflow_horizontal_overflow_props_.positionchange.md) |

**Returns:** `void`

___
<a id="scrollduration"></a>

### `<Optional>` scrollDuration

**● scrollDuration**: *`number`*

*Defined in [horizontal-overflow/horizontal-overflow.props.ts:51](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-base/src/horizontal-overflow/horizontal-overflow.props.ts#L51)*

The duration the scroll movement should last

___

