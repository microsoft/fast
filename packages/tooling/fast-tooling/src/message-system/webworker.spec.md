# Abstract

This spec outlines the functionality of the message system web worker which will store & enact data updates, store & enact navigation updates and store & enact history updates.

## Overview

The [web worker](./webworker.ts) is used as an entrypoint for the generated message system web worker. The main logic for data, navigation and history manipulation is contained in the [message system utilities](./message-system.utilities.ts). A single minified file is created and bundled with the package as a web worker a consumer can reference. Using the `MessageSystem` defined in `message-system.ts`, this web worker will be passed during instantiation so that the `MessageSystem` can control and perform the data, navigation and history updates.

## Data

<-- TODO: document the data interactions see #3822. -->
TBD

## Navigation

<-- TODO: document the navigation interactions see #3823. -->
TBD

## History

### Stored history

A history of different actions (data, navigation) will be stored as a local class instance.

Example of a history with 3 items:

```ts
[
    {
        type: "initialize",
        dataDictionary: [
            // data dictionary at this action
        ]
    }
    {
        type: "data",
        action: "update",
        dataDictionary: [
            // data dictionary at this action
        ]
    },
    {
        type: "navigation",
        action: "update-active-id",
        activeDictionaryId: "foo",
        activeNavigationConfigId: "bar",
    }
]
```

These stored items in history represent the "outgoing" messages sent from the message system when this action occurs.

### Current point in history

Along with the history stored, there will also be an `activeIndex` that points to the current place in history. Any time a non-history modifying event is triggered, such as a data update, any history items after the current `activeIndex` are removed, and the next history item added. This will allow for the same history behavior as other apps and for a non-branching history.

### Undo/redo

The history will allow for undo and redo actions which move the `activeIndex`. Each time this is done, an event of the same type stored in the history will be fired.

### History item limit

By default the number of history items will be unlimited. To impose a limit on stored history items, during construction of the `MessageSystem` an available option will be `historyLimit`.

Example:
```ts
import { MessageSystem } from "@microsoft/fast-tooling";

new MessageSystem({
    messageSystem: fastMessageSystem,
    historyLimit: 30
});
```

When the `historyLimit` is hit, the first item in the array will be removed as the new item is added.
