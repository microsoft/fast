[@microsoft/fast-animation](../README.md) > ["triggers/ScrollBase"](../modules/_triggers_scrollbase_.md) > [ScrollTrigger](../classes/_triggers_scrollbase_.scrolltrigger.md)

# Class: ScrollTrigger

Scroll trigger base-class that handles event binding and element/callback registration.

## Hierarchy

**ScrollTrigger**

↳  [ScrollTrigger](_triggers_scrolltrigger_.scrolltrigger.md)

↳  [ViewEnterTrigger](_triggers_viewentertrigger_.viewentertrigger.md)

↳  [ViewExitTrigger](_triggers_viewexittrigger_.viewexittrigger.md)

## Index

### Constructors

* [constructor](_triggers_scrollbase_.scrolltrigger.md#constructor)

### Properties

* [lastScrollY](_triggers_scrollbase_.scrolltrigger.md#lastscrolly)
* [openRequestAnimationFrame](_triggers_scrollbase_.scrolltrigger.md#openrequestanimationframe)
* [scrollDistance](_triggers_scrollbase_.scrolltrigger.md#scrolldistance)
* [subscriptions](_triggers_scrollbase_.scrolltrigger.md#subscriptions)
* [useRequestAnimationFrame](_triggers_scrollbase_.scrolltrigger.md#userequestanimationframe)

### Methods

* [isSubscribed](_triggers_scrollbase_.scrolltrigger.md#issubscribed)
* [requestFrame](_triggers_scrollbase_.scrolltrigger.md#requestframe)
* [subscribe](_triggers_scrollbase_.scrolltrigger.md#subscribe)
* [unsubscribe](_triggers_scrollbase_.scrolltrigger.md#unsubscribe)
* [update](_triggers_scrollbase_.scrolltrigger.md#update)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ScrollTrigger**(): [ScrollTrigger](_triggers_scrollbase_.scrolltrigger.md)

*Defined in [triggers/ScrollBase.ts:27](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L27)*

**Returns:** [ScrollTrigger](_triggers_scrollbase_.scrolltrigger.md)

___

## Properties

<a id="lastscrolly"></a>

### `<Private>` lastScrollY

**● lastScrollY**: *`number`*

*Defined in [triggers/ScrollBase.ts:27](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L27)*

___
<a id="openrequestanimationframe"></a>

### `<Private>` openRequestAnimationFrame

**● openRequestAnimationFrame**: *`boolean`* = false

*Defined in [triggers/ScrollBase.ts:25](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L25)*

___
<a id="scrolldistance"></a>

### `<Protected>` scrollDistance

**● scrollDistance**: *`number`* = 0

*Defined in [triggers/ScrollBase.ts:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L24)*

___
<a id="subscriptions"></a>

### `<Protected>` subscriptions

**● subscriptions**: *[ScrollTriggerSubscription](../interfaces/_triggers_scrollbase_.scrolltriggersubscription.md)[]* =  []

*Defined in [triggers/ScrollBase.ts:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L23)*

___
<a id="userequestanimationframe"></a>

### `<Private>` useRequestAnimationFrame

**● useRequestAnimationFrame**: *`boolean`* = false

*Defined in [triggers/ScrollBase.ts:26](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L26)*

___

## Methods

<a id="issubscribed"></a>

### `<Private>` isSubscribed

▸ **isSubscribed**(element: *`HTMLElement`*, callback: *[ScrollTriggerCallback](../modules/_triggers_scrollbase_.md#scrolltriggercallback)*): `boolean`

*Defined in [triggers/ScrollBase.ts:101](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L101)*

Checks to see if element/callback pairs have been registered so we don't duplicate registration.

**Parameters:**

| Name | Type |
| ------ | ------ |
| element | `HTMLElement` |
| callback | [ScrollTriggerCallback](../modules/_triggers_scrollbase_.md#scrolltriggercallback) |

**Returns:** `boolean`

___
<a id="requestframe"></a>

### `<Private>` requestFrame

▸ **requestFrame**(): `void`

*Defined in [triggers/ScrollBase.ts:114](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L114)*

Request's an animation frame if there are currently no open animation frame requests

**Returns:** `void`

___
<a id="subscribe"></a>

###  subscribe

▸ **subscribe**(element: *`HTMLElement`*, callback: *[ScrollTriggerCallback](../modules/_triggers_scrollbase_.md#scrolltriggercallback)*): `void`

*Defined in [triggers/ScrollBase.ts:42](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L42)*

Subscribe an element and callback for scroll triggers

**Parameters:**

| Name | Type |
| ------ | ------ |
| element | `HTMLElement` |
| callback | [ScrollTriggerCallback](../modules/_triggers_scrollbase_.md#scrolltriggercallback) |

**Returns:** `void`

___
<a id="unsubscribe"></a>

###  unsubscribe

▸ **unsubscribe**(element: *`HTMLElement`*, callback: *[ScrollTriggerCallback](../modules/_triggers_scrollbase_.md#scrolltriggercallback)*): `void`

*Defined in [triggers/ScrollBase.ts:71](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L71)*

Unsubscribe an element and callback for scroll triggers

**Parameters:**

| Name | Type |
| ------ | ------ |
| element | `HTMLElement` |
| callback | [ScrollTriggerCallback](../modules/_triggers_scrollbase_.md#scrolltriggercallback) |

**Returns:** `void`

___
<a id="update"></a>

### `<Protected>` update

▸ **update**(): `void`

*Defined in [triggers/ScrollBase.ts:91](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L91)*

Make any arbitrary updates to UI

**Returns:** `void`

___

