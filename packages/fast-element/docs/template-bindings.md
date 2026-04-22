# FAST Element Template Bindings Architecture

This document explains how the FAST Element `html` tagged template system stores bindings, applies them to DOM elements, triggers updates on data changes, and handles HTML-specific behaviors like event listeners.

## Overview

The template binding pipeline has five major stages:

1. **Template Authoring** – The `html` tagged template collects binding expressions and builds placeholder-marked HTML.
2. **Compilation** – The compiler parses the placeholder HTML into a `DocumentFragment`, walks the DOM tree, and records where each binding targets.
3. **View Creation** – The compiled result clones the fragment and creates a *targets* object that maps each binding to its DOM node.
4. **Binding (first render)** – Each factory creates a behavior that attaches to its target node: adding event listeners, setting attributes, or observing expressions.
5. **Reactive Updates** – When observed data changes, one-way binding observers notify their directive, which re-evaluates the expression and pushes the new value to the DOM through a "sink" function.

---

## Mermaid Diagrams

### 1. Template Creation & Storage

This diagram shows how the `html` tagged template literal processes interpolated values and stores them as factories keyed by unique IDs.

```mermaid
flowchart TD
    A["html`&lt;div class='${expr}'&gt;${text}&lt;/div&gt;`"] --> B["ViewTemplate.create(strings, values)"]
    B --> C{"For each interpolated value"}
    C -->|Function| D["Wrap in oneWay() → HTMLBindingDirective"]
    C -->|Binding instance| E["Wrap in HTMLBindingDirective"]
    C -->|HTMLDirective| F["Use directly"]
    C -->|Static value| G["Wrap in oneTime() → HTMLBindingDirective"]
    D --> H["directive.createHTML(add)"]
    E --> H
    F --> H
    G --> H
    H --> I["add(factory) assigns unique ID"]
    I --> J["factories Record&lt;string, ViewBehaviorFactory&gt;"]
    I --> K["Returns placeholder marker in HTML string"]
    K --> L["Aspect Detection via lastAttributeNameRegex"]
    L -->|In attribute context| M["HTMLDirective.assignAspect(directive, attrName)"]
    L -->|In text content| N["aspectType = DOMAspect.content"]
    M --> O{"Attribute prefix"}
    O -->|No prefix| P["DOMAspect.attribute"]
    O -->|: prefix| Q["DOMAspect.property"]
    O -->|? prefix| R["DOMAspect.booleanAttribute"]
    O -->|"@" prefix| S["DOMAspect.event"]
    O -->|:classList| T["DOMAspect.tokenList"]
    J --> U["new ViewTemplate(html, factories)"]
```

### 2. Compilation – Walking the DOM & Storing Target Locations

The compiler transforms the placeholder-laden HTML into a `DocumentFragment` and builds a prototype with lazy property descriptors that navigate to target nodes by child index.

```mermaid
flowchart TD
    A["ViewTemplate.compile()"] --> B["Compiler.compile(html, factories, policy)"]
    B --> C["Create HTMLTemplateElement"]
    C --> D["template.innerHTML = policy.createHTML(html)"]
    D --> E["document.adoptNode(template.content) → fragment"]
    E --> F["new CompilationContext(fragment, factories, policy)"]
    F --> G["compileAttributes(context, template, 'h') — host bindings"]
    G --> H["compileChildren(context, fragment, 'r') — root"]

    H --> I{"For each child node"}
    I -->|Element node type=1| J["compileAttributes: parse each attribute value"]
    J --> K{"Parser.parse finds placeholders?"}
    K -->|Yes| L["Remove attribute from DOM"]
    L --> M["context.addFactory(factory, parentId, nodeId, index, tagName)"]
    I -->|Element node| N["compileChildren recursively"]
    I -->|Text node type=3| O["compileContent: Parser.parse text"]
    O --> P{"Placeholders found?"}
    P -->|Yes| Q["Split text node, insert new text nodes"]
    Q --> R["context.addFactory for each directive part"]
    I -->|Comment node type=8| S["Parser.parse comment data"]
    S --> T["context.addFactory for structural directives"]

    M --> U["addTargetDescriptor(parentId, nodeId, childIndex)"]
    U --> V["Lazy getter: this[parentId].childNodes[childIndex]"]
    V --> W["Stored in descriptors → prototype via Object.create"]

    subgraph "Target Node ID Scheme"
        X["Root: 'r'"]
        Y["Host: 'h'"]
        Z["Children: 'r.0', 'r.1', 'r.0.2'"]
        AA["Encodes DOM tree path via dot-separated child indices"]
    end

    W --> AB["context.freeze() → compilation result"]
```

### 3. View Creation – Cloning the Fragment & Resolving Targets

```mermaid
flowchart TD
    A["compilationResult.createView(hostBindingTarget?)"] --> B["fragment.cloneNode(true) → new DocumentFragment"]
    B --> C["targets = Object.create(proto)"]
    C --> D["targets.r = fragment (root)"]
    D --> E["targets.h = hostBindingTarget (host element)"]
    E --> F{"For each registered nodeId"}
    F --> G["Access targets[nodeId] — triggers lazy getter chain"]
    G --> H["Getter resolves: this[parentId].childNodes[childIndex]"]
    H --> I["Caches result in targets._nodeId field"]
    I --> J["new HTMLView(fragment, factories, targets)"]

    subgraph "HTMLView Structure"
        K["fragment: DocumentFragment with cloned DOM"]
        L["factories: CompiledViewBehaviorFactory[]"]
        M["targets: ViewBehaviorTargets {nodeId → Node}"]
        N["firstChild / lastChild: boundary nodes"]
        O["source: null (until bound)"]
        P["behaviors: null (created on first bind)"]
    end
    J --> K
    J --> L
    J --> M
```

### 4. Binding – Attaching Behaviors to DOM Nodes

```mermaid
flowchart TD
    A["view.bind(source)"] --> B{"First bind?"}
    B -->|Yes| C["Set view.source = source"]
    C --> D["Create behaviors array"]
    D --> E{"For each factory"}
    E --> F["factory.createBehavior()"]
    F --> G["Select sink from sinkLookup based on aspectType"]
    G --> H["Wrap sink through policy.protect()"]
    H --> I["behavior.bind(controller/view)"]

    B -->|Subsequent| J["Unbind previous, set new source"]
    J --> K["Re-bind existing behaviors"]

    I --> L{"aspectType?"}

    L -->|DOMAspect.event| M["Store controller ref on target node"]
    M --> N["target.addEventListener(targetAspect, directive, options)"]
    N --> O["directive IS the EventListener via handleEvent()"]

    L -->|DOMAspect.content| P["Register unbind handler"]
    P --> Q["Create observer via dataBinding.createObserver()"]

    L -->|attribute / property / etc.| Q

    Q --> R["observer.bind(controller) → evaluates expression"]
    R --> S["updateTarget(target, aspect, value, controller)"]

    subgraph "Sink Functions (sinkLookup)"
        S1["attribute → DOM.setAttribute(target, name, value)"]
        S2["booleanAttribute → DOM.setBooleanAttribute(target, name, value)"]
        S3["property → target[name] = value"]
        S4["content → updateContent() — manages text or composed views"]
        S5["tokenList → updateTokenList() — classList with versioning"]
        S6["event → no-op (handled via addEventListener)"]
    end
```

### 5. Reactive Update Cycle – Change Detection & DOM Updates

```mermaid
sequenceDiagram
    participant Source as Data Source
    participant Observable as Observable System
    participant Observer as ExpressionObserver (OneWayBinding)
    participant Directive as HTMLBindingDirective
    participant Sink as UpdateTarget (sink fn)
    participant DOM as Target DOM Node

    Note over Source,DOM: Initial Bind
    Directive->>Observer: dataBinding.createObserver(directive, directive)
    Observer->>Source: Evaluate expression (tracks property access)
    Source-->>Observer: Return value + record dependencies
    Directive->>Sink: updateTarget(target, aspect, value, controller)
    Sink->>DOM: Apply value (setAttribute, textContent, etc.)

    Note over Source,DOM: Data Change
    Source->>Observable: Property setter triggered
    Observable->>Observer: Notify subscriber of change
    Observer->>Directive: handleChange(binding, observer)
    Directive->>Observer: observer.bind(controller) — re-evaluate
    Observer->>Source: Re-evaluate expression
    Source-->>Observer: Return new value
    Directive->>Sink: updateTarget(target, aspect, newValue, controller)
    Sink->>DOM: Update DOM with new value
```

### 6. Event Handling – Click Events and Other DOM Events

```mermaid
sequenceDiagram
    participant User as User Interaction
    participant DOM as Target DOM Element
    participant Directive as HTMLBindingDirective (EventListener)
    participant Context as ExecutionContext
    participant Binding as dataBinding.evaluate()
    participant Source as Component Source

    Note over DOM: During bind: target.addEventListener("click", directive)
    Note over DOM: directive stores controller ref on target[data]

    User->>DOM: Click event fires
    DOM->>Directive: handleEvent(event)
    Directive->>DOM: Read controller from event.currentTarget[data]
    Directive->>Directive: Check controller.isBound
    Directive->>Context: ExecutionContext.setEvent(event)
    Directive->>Binding: evaluate(controller.source, controller.context)
    Binding->>Source: Execute handler: (s, c) => s.handleClick(c.event)
    Source-->>Binding: Return result
    Binding-->>Directive: Return result
    alt result !== true
        Directive->>DOM: event.preventDefault()
    end
    Directive->>Context: ExecutionContext.setEvent(null)
```

### 7. Content Binding – Template Composition

When a binding expression returns a `ContentTemplate` (e.g., another `ViewTemplate`), the content update sink composes a child view into the DOM.

```mermaid
flowchart TD
    A["updateContent(target, aspect, value, controller)"] --> B{"value is null/undefined?"}
    B -->|Yes| C["Treat as empty string"]
    B -->|No| D{"value.create exists? (ContentTemplate)"}

    D -->|Yes — Template| E["Clear target.textContent"]
    E --> F{"Existing view on target.$fastView?"}
    F -->|No| G["view = value.create()"]
    F -->|Yes, same template| H["Reuse existing view"]
    F -->|Yes, different template| I["Remove old view, create new"]
    G --> J["view.bind(source, context)"]
    I --> J
    J --> K["view.insertBefore(target)"]
    K --> L["Cache: target.$fastView = view, target.$fastTemplate = value"]

    D -->|No — Primitive| M{"Existing composed view?"}
    M -->|Yes| N["view.remove(), view.unbind()"]
    N --> O["target.textContent = value"]
    M -->|No| O
```

---

## Key Data Structures

| Structure | Location | Purpose |
|---|---|---|
| `ViewTemplate` | template.ts | Holds raw HTML + factories record. Entry point for compilation. |
| `factories: Record<string, ViewBehaviorFactory>` | template.ts | Maps unique IDs to binding factories (directives). |
| `CompilationContext` | compiler.ts | Accumulates factories and builds the target prototype during compilation. |
| `targets: ViewBehaviorTargets` | view.ts / html-directive.ts | Maps node IDs (e.g., `"r.0.2"`) to actual DOM nodes in a cloned fragment. |
| `HTMLView` | view.ts | The live view instance: holds the fragment, factories, targets, behaviors, and source. |
| `HTMLBindingDirective` | html-binding-directive.ts | The core binding: acts as factory, behavior, and event listener. |
| `sinkLookup` | html-binding-directive.ts | Maps `DOMAspect` types to DOM update functions. |
| `Binding` (abstract) | binding/binding.ts | Wraps an expression with policy, volatility, and observer creation. |
| `ExpressionObserver` | observation/observable.ts | Tracks dependencies during expression evaluation and notifies on change. |

## Binding Type Summary

| Markup Syntax | Aspect Type | Sink Function | Example |
|---|---|---|---|
| `attr="${x => x.val}"` | `attribute` | `DOM.setAttribute` | `class="${x => x.cls}"` |
| `?attr="${x => x.val}"` | `booleanAttribute` | `DOM.setBooleanAttribute` | `?disabled="${x => x.off}"` |
| `:prop="${x => x.val}"` | `property` | `target[prop] = value` | `:value="${x => x.name}"` |
| `:classList="${x => x.val}"` | `tokenList` | `updateTokenList` | `:classList="${x => x.classes}"` |
| `@event="${x => x.handler}"` | `event` | addEventListener | `@click="${(x,c) => x.onClick(c.event)}"` |
| `${x => x.val}` (in text) | `content` | `updateContent` | `<p>${x => x.msg}</p>` |

---

## Hydration: Attaching Bindings to Server-Rendered DOM

When a page is server-side rendered (SSR) with Declarative Shadow DOM, the HTML arrives in the browser fully formed. Instead of creating new DOM nodes, FAST's hydration system **reuses the existing DOM** and attaches reactive bindings to it. This section explains how hydration markers in the SSR output guide the client-side binding process.

### Enabling Hydration

Hydration is an opt-in, tree-shakeable feature. Importing `install-hydratable-view-templates.ts` patches `ViewTemplate.prototype` with:
1. A `Hydratable` symbol — marks the template as hydration-capable (checked via `isHydratable()`).
2. A `hydrate(firstChild, lastChild, hostBindingTarget?)` method — creates a `HydrationView` instead of an `HTMLView`.

```typescript
// This import enables hydration for all ViewTemplate instances
import "@microsoft/fast-element/install-hydratable-view-templates";
```

### Hydration Marker Format

The SSR renderer embeds comment nodes and data attributes into the HTML to mark where bindings should attach. These markers encode the **factory index** (position in the compiled factories array) so the client can map each marker back to its corresponding `ViewBehaviorFactory`.

#### Attribute Binding Markers

Elements with attribute/property/event bindings receive a `data-fe` attribute with the binding count:

```html
<!-- SSR output for: <div class="${x => x.cls}" :value="${x => x.val}"> -->
<div data-fe="2">server-rendered content</div>
```

The attribute marker format is:

| Attribute | Example | Description |
|---|---|---|
| `data-fe` | `data-fe="3"` | Binding count — the number of attribute bindings on the element |

#### Content Binding Markers

Text/template content bindings are wrapped in paired data-free comment nodes (matched by string equality, paired by balanced depth counting):

```html
<!--fe:b-->
Hello, World!
<!--fe:/b-->
```

#### Repeat Directive Markers

Each repeated item is bracketed by data-free repeat markers:

```html
<!--fe:r-->
<li>First item</li>
<!--fe:/r-->
<!--fe:r-->
<li>Second item</li>
<!--fe:/r-->
```

#### Element Boundary Markers

Nested custom elements that also need hydration are demarcated so the parent's walker can skip over them:

```html
<!--fe:e-->
<child-element>
  <template shadowrootmode="open">...child shadow DOM...</template>
</child-element>
<!--fe:/e-->
```

### Hydration Binding Flow

```mermaid
flowchart TD
    A["Server renders HTML with Declarative Shadow DOM"] --> B["Browser parses HTML, creates DOM + shadow roots"]
    B --> C["Custom element connects, HydratableElementController activates"]
    C --> D{"Has 'defer-hydration' attribute?"}
    D -->|Yes| E["Wait until attribute is removed"]
    D -->|No| F["template.hydrate(firstChild, lastChild, hostBindingTarget)"]
    E -->|Attribute removed| F
    F --> G["new HydrationView(firstChild, lastChild, sourceTemplate)"]
    G --> H["HydrationView.bind(source)"]
    H --> I["Stage: unhydrated → hydrating"]
    I --> J["buildViewBindingTargets(firstChild, lastChild, factories)"]

    J --> K["Create TreeWalker over existing DOM range"]
    K --> L{"Walk each node"}

    L -->|Element node| M["Parse data-fe attribute"]
    M --> N["Map factory indices to this element via targetFactory()"]
    N --> O["Remove data-fe marker attribute"]

    L -->|Comment: content marker| P["Match fe:b start marker by string equality"]
    P --> Q["Walk siblings to find matching fe:/b end marker\nusing balanced depth counting"]
    Q --> R{"Content between markers?"}
    R -->|Single text node| S["Target factory to text node directly"]
    R -->|Multiple nodes / template| T["Store boundaries in ViewBehaviorBoundaries"]
    T --> U["Insert dummy text node as target for future string updates"]
    R -->|Empty null/false binding| U
    L -->|Comment: element boundary| V["Clear fe:e start marker data\nSkip to matching fe:/e end marker\nusing balanced depth counting\nClear fe:/e end marker data\nThrow if end marker not found"]
    L -->|Other| W["Continue walking"]
    J --> X["Return { targets, boundaries }"]
    X --> Y["Create behaviors from factories"]
    Y --> Z["behavior.bind(hydrationView)"]
    Z --> AA["Stage: hydrating → hydrated"]

    subgraph "Host Binding Offset"
        BB["Host bindings (targetNodeId='h') are at the start of the factories array"]
        CC["getHydrationIndexOffset() counts host bindings to skip"]
        DD["SSR markers use indices relative to non-host factories"]
    end
```

### HydrationView vs HTMLView

```mermaid
flowchart LR
    subgraph "HTMLView (client-rendered)"
        A1["Compiler produces DocumentFragment"] --> A2["fragment.cloneNode(true)"]
        A2 --> A3["Resolve targets via prototype getter chain"]
        A3 --> A4["Create behaviors & bind"]
    end

    subgraph "HydrationView (server-rendered)"
        B1["DOM already exists in shadow root"] --> B2["TreeWalker scans for markers"]
        B2 --> B3["buildViewBindingTargets maps markers → nodes"]
        B3 --> B4["Create behaviors & bind to existing nodes"]
        B4 --> B5["Marker comments cleared (data set to empty string)"]
    end
```

| Aspect | HTMLView | HydrationView |
|---|---|---|
| **DOM source** | Clones compiled DocumentFragment | Reuses server-rendered DOM in place |
| **Target resolution** | Prototype getters via childNodes indices | TreeWalker + hydration marker parsing |
| **Node creation** | Creates all DOM nodes from scratch | No node creation (reuses existing) |
| **Fragment** | Holds cloned fragment, moved into host | No fragment initially (created only on remove) |
| **Lifecycle** | Ready immediately after creation | Transitions through unhydrated → hydrating → hydrated |
| **Validation** | Compilation guarantees structure | Must validate markers match factories (throws HydrationBindingError) |
| **Boundaries** | Not needed (compiler tracks structure) | `bindingViewBoundaries` stores first/last node pairs for structural directives |

### Content Binding Hydration

When `HTMLBindingDirective.bind()` runs during hydration and the binding returns a `ContentTemplate`, the `updateContent` sink checks for pre-rendered boundaries:

```mermaid
sequenceDiagram
    participant Directive as HTMLBindingDirective
    participant Controller as HydrationView (controller)
    participant Sink as updateContent()
    participant Template as ContentTemplate

    Directive->>Controller: bind(controller)
    Note over Directive: aspectType = DOMAspect.content
    Directive->>Sink: updateTarget(target, aspect, value, controller)
    Sink->>Sink: value is ContentTemplate?

    alt Hydrating & boundaries exist
        Sink->>Controller: Check bindingViewBoundaries[targetNodeId]
        Controller-->>Sink: { first: Node, last: Node }
        Sink->>Template: value.hydrate(first, last)
        Template-->>Sink: HydrationView (reuses existing nodes)
        Sink->>Sink: view.bind(source, context) — attaches to pre-rendered DOM
    else Already hydrated or no boundaries
        Sink->>Template: value.create()
        Template-->>Sink: HTMLView (creates new nodes)
        Sink->>Sink: view.bind + view.insertBefore
    end
```

### Repeat Directive Hydration

The repeat directive hydrates by walking **backwards** from its location marker, finding paired repeat markers for each array item:

```mermaid
flowchart TD
    A["RepeatBehavior.bind(controller)"] --> B{"isHydratable(template) && hydrating?"}
    B -->|Yes| C["hydrateViews(template)"]
    B -->|No| D["refreshAllViews() — normal client path"]

    C --> E["Allocate views array sized to items.length"]
    E --> F["Start at location.previousSibling, walk backwards"]

    F --> G{"Current node is comment?"}
    G -->|No| H["Skip, move to previousSibling"]
    G -->|Yes| I{"isRepeatEndMarker (string equality)?"}
    I -->|No| H
    I -->|Yes, index N| J["Clear end marker comment data"]

    J --> K["end = previous sibling of end marker"]
    K --> L["Walk backwards to find matching start marker"]
    L --> M{"Handle nested repeats via unmatchedEndMarkers counter"}
    M --> N["Found start marker with same index N"]
    N --> O["Clear start marker, start = startMarker.nextSibling"]
    O --> P["template.hydrate(start, end) → HydrationView"]
    P --> Q["views[N] = view"]
    Q --> R["bindView(view, items, N, controller)"]
    R --> F

    subgraph "Result"
        S["Each array item mapped to a HydrationView"]
        T["Views reuse server-rendered DOM between markers"]
        U["Markers cleared to empty strings (invisible in DOM)"]
    end
```

### Hydration Stage Lifecycle

```mermaid
stateDiagram-v2
    [*] --> unhydrated: HydrationView created

    unhydrated --> hydrating: bind() called
    note right of hydrating
        buildViewBindingTargets() scans DOM
        Markers parsed, targets resolved
        Behaviors created and bound
        Attribute bindings skip DOM update
        (server already set correct values)
    end note

    hydrating --> hydrated: All behaviors bound
    note right of hydrated
        Subsequent bind() calls
        behave like normal HTMLView rebind
        (re-evaluate expressions, update DOM)
    end note

    hydrated --> hydrated: rebind with new source
```

During the `hydrating` stage, attribute and boolean-attribute bindings **skip their initial DOM update** (the server already rendered the correct value). This avoids unnecessary DOM writes during hydration:

```typescript
// In HTMLBindingDirective.bind(), during hydration:
if (isHydrating && (this.aspectType === DOMAspect.attribute ||
                    this.aspectType === DOMAspect.booleanAttribute)) {
    observer.bind(controller);  // Set up observation only
    break;                      // Skip updateTarget — server value is current
}
```

### Error Handling

When the server-rendered DOM doesn't match the client template, hydration throws descriptive errors:

| Error | Cause | Contains |
|---|---|---|
| `HydrationTargetElementError` | `data-fe` specifies a binding count that cannot be satisfied, more content binding markers exist than factories, or an element boundary end marker is missing | Factory list, target node, template string |
| `HydrationBindingError` | A factory's `targetNodeId` has no matching entry in targets | Factory, cloned fragment, template string, available target IDs |
| `HydrationRepeatError` | Repeat hydration cannot match items while scanning backward through repeat markers with depth counting, or item count mismatches between SSR DOM and client data | Hydration stage, items length, view states |
| `FAST.error(1210)` | `data-fe` attribute contains a non-numeric or non-positive value | Attribute value |

These errors typically indicate a mismatch between the server-rendered HTML and the client-side template definition.
