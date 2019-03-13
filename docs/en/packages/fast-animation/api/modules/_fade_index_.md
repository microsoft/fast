[@microsoft/fast-animation](../README.md) > ["fade/index"](../modules/_fade_index_.md)

# External module: "fade/index"

## Index

### Variables

* [fadeInKeyframes](_fade_index_.md#fadeinkeyframes)
* [fadeOutKeyframes](_fade_index_.md#fadeoutkeyframes)

### Functions

* [applyFade](_fade_index_.md#applyfade)
* [fadeIn](_fade_index_.md#fadein)
* [fadeOut](_fade_index_.md#fadeout)

### Object literals

* [fadeEffectTiming](_fade_index_.md#fadeeffecttiming)

---

## Variables

<a id="fadeinkeyframes"></a>

### `<Const>` fadeInKeyframes

**● fadeInKeyframes**: *`Array`<`Partial`<`Keyframe`>>* =  [
    { opacity: "0.01" }, // Start at 0.01 due to a bug animating from 0
    { opacity: "1" },
]

*Defined in [fade/index.ts:8](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/fade/index.ts#L8)*

Key frame object for fade-in animations

___
<a id="fadeoutkeyframes"></a>

### `<Const>` fadeOutKeyframes

**● fadeOutKeyframes**: *`Array`<`Partial`<`Keyframe`>>* =  [
    { opacity: "1" },
    { opacity: "0" },
]

*Defined in [fade/index.ts:16](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/fade/index.ts#L16)*

Key frame object for fade-out animations

___

## Functions

<a id="applyfade"></a>

###  applyFade

▸ **applyFade**(element: *`HTMLElement`*, keyframes: *`Array`<`Partial`<`Keyframe`>>*, timing?: *`EffectTiming`*): `AnimateTo`

*Defined in [fade/index.ts:46](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/fade/index.ts#L46)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| element | `HTMLElement` | - |
| keyframes | `Array`<`Partial`<`Keyframe`>> | - |
| `Default value` timing | `EffectTiming` |  {} |

**Returns:** `AnimateTo`

___
<a id="fadein"></a>

###  fadeIn

▸ **fadeIn**(element: *`HTMLElement`*, effectTiming?: *`EffectTiming`*): `AnimateTo`

*Defined in [fade/index.ts:32](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/fade/index.ts#L32)*

Creates an animation to fade an element into view

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| element | `HTMLElement` | - |
| `Default value` effectTiming | `EffectTiming` |  {} |

**Returns:** `AnimateTo`

___
<a id="fadeout"></a>

###  fadeOut

▸ **fadeOut**(element: *`HTMLElement`*, effectTiming?: *`EffectTiming`*): `AnimateTo`

*Defined in [fade/index.ts:39](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/fade/index.ts#L39)*

Creates an animation to fade an element out of view

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| element | `HTMLElement` | - |
| `Default value` effectTiming | `EffectTiming` |  {} |

**Returns:** `AnimateTo`

___

## Object literals

<a id="fadeeffecttiming"></a>

### `<Const>` fadeEffectTiming

**fadeEffectTiming**: *`object`*

*Defined in [fade/index.ts:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/fade/index.ts#L24)*

EffectTiming defaults for fade animations

<a id="fadeeffecttiming.duration"></a>

####  duration

**● duration**: *`number`* = 500

*Defined in [fade/index.ts:26](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/fade/index.ts#L26)*

___
<a id="fadeeffecttiming.easing"></a>

####  easing

**● easing**: *`string`* = "linear"

*Defined in [fade/index.ts:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/fade/index.ts#L25)*

___

___

