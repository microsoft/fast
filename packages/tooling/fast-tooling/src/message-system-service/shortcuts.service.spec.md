# Abstract

The shortcuts service accepts an instance of the `MessageSystem` and through this sends information about available shortcuts and events.

## Instantiating

All the `Shortcuts` class needs to instantiate is an instance of the `MessageSystem`. It should then fire a custom event notifying all other items registered to the message system that shortcuts are available, with a listener that will capture keypress and identify which shortcut action to execute.

```typescript
import { Shortcut } from "@microsoft/fast-tooling"

new Shortcuts({
    messageSystem: fastMessageSystem
});
```

The `Shortcuts` class also stores each action provided to it by an `id`. This will then allow an `id` to be referenced and the associated action called.

Example:
```typescript
const shortcuts = new Shortcuts({
    messageSystem: fastMessageSystem,
    actions: [
        // Custom shortcut
        new ShortcutsAction({
            id: "random",
            name: "Random action",
            keys: [
                {
                    altKey: true
                },
                {
                    value: "Tab"
                }
            ],
            action: () => {
                // perform some action
                // use the fastMessageSystem
                // to manipulate the data dictionary,
                // history, or navigation
            }
        }),
    ]
});

shortcuts.action("random").run();
```

## Adding shortcut actions

Shortcut actions can either be custom or imported from a set of actions available.

```typescript
import { DuplicateShortcutsAction, ShortcutsAction, Shortcuts } from "@microsoft/fast-tooling"

new Shortcuts({
    messageSystem: fastMessageSystem,
    actions: [
        // Custom shortcut
        new ShortcutsAction({
            name: "Random action",
            keys: [
                {
                    altKey: true
                },
                {
                    value: "Tab"
                }
            ],
            action: () => {
                // perform some action
                // use the fastMessageSystem
                // to manipulate the data dictionary,
                // history, or navigation
            }
        }),
        // Pre-defined shortcut
        new DuplicateShortcutsAction()
    ]
});
```

The `ShortcutsAction` class should also contain a `matches` method that takes a `KeyboardEvent` as an argument and returns a boolean if the given event matches the keys it has been provided with.

## Attaching the event listener

A keypress event listener will be created and passed as part of the Shortcuts service config through the `MessageSystem` so that a user can retrieve it.

An example of retrieving the Shortcuts service config:

```typescript
messageSystem.getConfigById(shortcutsId).eventListener;
```

An example of using the custom event to allow all shortcuts to be performed on an anchor:

```html
<a id="foo">MyAnchor</a>
```

```ts
const myAnchor = document.getElementById("foo");
const config = messageSystem.getConfigById(shortcutsId);

myAnchor.addEventListener(config.eventListenerType, config.eventListener);
```

## Additional notes

The custom message that initializes must include enough information for a context menu to be able to transform into UI.
