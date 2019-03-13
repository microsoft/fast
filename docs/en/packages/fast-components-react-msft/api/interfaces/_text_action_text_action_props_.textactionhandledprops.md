[@microsoft/fast-components-react-msft](../README.md) > ["text-action/text-action.props"](../modules/_text_action_text_action_props_.md) > [TextActionHandledProps](../interfaces/_text_action_text_action_props_.textactionhandledprops.md)

# Interface: TextActionHandledProps

## Hierarchy

 `object`

↳  [TextActionManagedClasses](_text_action_text_action_props_.textactionmanagedclasses.md)

**↳ TextActionHandledProps**

## Index

### Properties

* [afterGlyph](_text_action_text_action_props_.textactionhandledprops.md#afterglyph)
* [beforeGlyph](_text_action_text_action_props_.textactionhandledprops.md#beforeglyph)
* [button](_text_action_text_action_props_.textactionhandledprops.md#button)
* [buttonPosition](_text_action_text_action_props_.textactionhandledprops.md#buttonposition)
* [managedClasses](_text_action_text_action_props_.textactionhandledprops.md#managedclasses)

---

## Properties

<a id="afterglyph"></a>

### `<Optional>` afterGlyph

**● afterGlyph**: *`function`*

*Defined in [text-action/text-action.props.ts:47](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-msft/src/text-action/text-action.props.ts#L47)*

The trailing glyph

#### Type declaration
▸(classname?: *`string`*): `React.ReactNode`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` classname | `string` |

**Returns:** `React.ReactNode`

___
<a id="beforeglyph"></a>

### `<Optional>` beforeGlyph

**● beforeGlyph**: *`function`*

*Defined in [text-action/text-action.props.ts:42](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-msft/src/text-action/text-action.props.ts#L42)*

The preceding glyph

#### Type declaration
▸(classname?: *`string`*): `React.ReactNode`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` classname | `string` |

**Returns:** `React.ReactNode`

___
<a id="button"></a>

### `<Optional>` button

**● button**: *`function`*

*Defined in [text-action/text-action.props.ts:26](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-msft/src/text-action/text-action.props.ts#L26)*

The text action button

#### Type declaration
▸(classname?: *`string`*, disabled?: *`boolean`*, appearance?: *[ButtonAppearance](../enums/_button_button_props_.buttonappearance.md)*): `React.ReactNode`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` classname | `string` |
| `Optional` disabled | `boolean` |
| `Optional` appearance | [ButtonAppearance](../enums/_button_button_props_.buttonappearance.md) |

**Returns:** `React.ReactNode`

___
<a id="buttonposition"></a>

### `<Optional>` buttonPosition

**● buttonPosition**: *[TextActionButtonPosition](../enums/_text_action_text_action_props_.textactionbuttonposition.md)*

*Defined in [text-action/text-action.props.ts:37](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-components-react-msft/src/text-action/text-action.props.ts#L37)*

Text action button position We can only have one button at a time, so rather than allowing a before and after like glyph, we need to specify through an enum

___
<a id="managedclasses"></a>

### `<Optional>` managedClasses

**● managedClasses**: *`object`*

*Inherited from ManagedClasses.managedClasses*

*Defined in D:/projects/fast-dna/packages/fast-components-react-msft/node_modules/@microsoft/fast-components-class-name-contracts-msft/node_modules/@microsoft/fast-components-class-name-contracts-base/dist/managed-classes.d.ts:13*

#### Type declaration

___

