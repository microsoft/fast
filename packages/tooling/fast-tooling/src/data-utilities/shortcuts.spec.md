# Abstract

The shortcuts utility accepts an instance of the `MessageSystem` and through this sends information about available shortcuts and events.

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
        new ShortcutAction({
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
import { DuplicateShortcutAction, ShortcutAction, Shortcuts } from "@microsoft/fast-tooling"

new Shortcuts({
    messageSystem: fastMessageSystem,
    actions: [
        // Custom shortcut
        new ShortcutAction({
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
        new DuplicateShortcutAction()
    ]
});
```

The `ShortcutAction` class should also contain a `matches` method that takes a `KeyboardEvent` as an argument and returns a boolean if the given event matches the keys it has been provided with.

## Attaching the event listener

A keypress event listener will be created and passed through the `MessageSystem` so that a user can choose where to attach them.

An example of the custom event that might be sent:

```typescript
{
    type: MessageSystemType.custom,
    id: "shortcuts",
    action: "initialize",
    eventListener: listener,
    eventListenerType: "keypress",
    shortcuts: [
        {
            name: "Random action",
            keys: [
                {
                    altKey: true,
                },
                {
                    value: "Tab"
                }
            ],
            // executing this passed function should
            // perform the same action
            action: func
        },
        {
            name: "Duplicate",
            keys: [
                {
                    ctrlKey: true,
                },
                {
                    value: "d"
                }
            ],
            action: func
        }
    ]
}
```

An example of a React component using the custom event to allow all shortcuts to be performed on an anchor:

```tsx
class Example extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return <a ref={this.anchorRef}>MyAnchor</a>;
    }

    private handleMessageSystem = (e: MessageEvent): void => {
        if (
            e.type === MessageSystemType.custom
            && e.id === "shortcuts"
        ) {
            this.anchorRef.current.addEventListener(
                e.eventListenerType,
                eventListener
            );
        }
    }
}
```

## Additional notes

The custom message that initializes must include enough information for a context menu to be able to transform into UI.
