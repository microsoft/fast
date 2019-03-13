[@microsoft/fast-animation](../README.md) > ["triggers/ViewExitTrigger"](../modules/_triggers_viewexittrigger_.md) > [ViewExitTrigger](../classes/_triggers_viewexittrigger_.viewexittrigger.md)

# Class: ViewExitTrigger

Utility for registering element/callback pairs where the callback will be called when the element exits the view-port

## Hierarchy

 [ScrollTrigger](_triggers_scrollbase_.scrolltrigger.md)

**↳ ViewExitTrigger**

## Index

### Constructors

* [constructor](_triggers_viewexittrigger_.viewexittrigger.md#constructor)

### Properties

* [scrollDistance](_triggers_viewexittrigger_.viewexittrigger.md#scrolldistance)
* [subscriptions](_triggers_viewexittrigger_.viewexittrigger.md#subscriptions)

### Methods

* [subscribe](_triggers_viewexittrigger_.viewexittrigger.md#subscribe)
* [unsubscribe](_triggers_viewexittrigger_.viewexittrigger.md#unsubscribe)
* [update](_triggers_viewexittrigger_.viewexittrigger.md#update)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ViewExitTrigger**(): [ViewExitTrigger](_triggers_viewexittrigger_.viewexittrigger.md)

*Inherited from [ScrollTrigger](_triggers_scrollbase_.scrolltrigger.md).[constructor](_triggers_scrollbase_.scrolltrigger.md#constructor)*

*Defined in [triggers/ScrollBase.ts:27](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L27)*

**Returns:** [ViewExitTrigger](_triggers_viewexittrigger_.viewexittrigger.md)

___

## Properties

<a id="scrolldistance"></a>

### `<Protected>` scrollDistance

**● scrollDistance**: *`number`* = 0

*Inherited from [ScrollTrigger](_triggers_scrollbase_.scrolltrigger.md).[scrollDistance](_triggers_scrollbase_.scrolltrigger.md#scrolldistance)*

*Defined in [triggers/ScrollBase.ts:24](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L24)*

___
<a id="subscriptions"></a>

### `<Protected>` subscriptions

**● subscriptions**: *[ScrollTriggerSubscription](../interfaces/_triggers_scrollbase_.scrolltriggersubscription.md)[]* =  []

*Inherited from [ScrollTrigger](_triggers_scrollbase_.scrolltrigger.md).[subscriptions](_triggers_scrollbase_.scrolltrigger.md#subscriptions)*

*Defined in [triggers/ScrollBase.ts:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ScrollBase.ts#L23)*

___

## Methods

<a id="subscribe"></a>

###  subscribe

▸ **subscribe**(element: *`HTMLElement`*, callback: *[ScrollTriggerCallback](../modules/_triggers_scrollbase_.md#scrolltriggercallback)*): `void`

*Inherited from [ScrollTrigger](_triggers_scrollbase_.scrolltrigger.md).[subscribe](_triggers_scrollbase_.scrolltrigger.md#subscribe)*

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

*Inherited from [ScrollTrigger](_triggers_scrollbase_.scrolltrigger.md).[unsubscribe](_triggers_scrollbase_.scrolltrigger.md#unsubscribe)*

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

*Overrides [ScrollTrigger](_triggers_scrollbase_.scrolltrigger.md).[update](_triggers_scrollbase_.scrolltrigger.md#update)*

*Defined in [triggers/ViewExitTrigger.ts:11](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/triggers/ViewExitTrigger.ts#L11)*

Check if elements are in view-port and apply scroll method if they are

**Returns:** `void`

___

