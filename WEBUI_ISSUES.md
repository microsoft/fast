# WebUI Rendering Issues

This document lists the differences between the rendering output of `@microsoft/fast-build` (correct) and `@microsoft/webui` with `--plugin=fast` when processing the same FAST HTML fixture templates. These issues were discovered by running the `packages/fast-html/test/fixtures/` Playwright test suite against webui-rendered output.

**Result summary:** 86 tests passed, 44 tests failed, 1 flaky (out of 131 total).

---

## 1. Conditional Directives (`<f-when>`) Not Evaluated Server-Side

**Severity:** Critical — causes 20+ test failures across `when`, `deep-merge`, `repeat`, `observer-map`, and `repeat-event` fixtures.

**fast-build behavior (correct):**
Evaluates `<f-when>` conditions against state at render time. True branches render their content; false branches render as empty comment markers.

```html
<!-- vara="3", condition: vara == 3 → true -->
<test-element-equals id="equals-true" vara="3">
  <template shadowrootmode="open">
    <!--fe-b$$start$$0$$when-0$$fe-b-->Equals 3<!--fe-b$$end$$0$$when-0$$fe-b-->
  </template>
</test-element-equals>

<!-- vara="4", condition: vara == 3 → false -->
<test-element-equals id="equals-false" vara="4">
  <template shadowrootmode="open">
    <!--fe-b$$start$$0$$when-0$$fe-b--><!--fe-b$$end$$0$$when-0$$fe-b-->
  </template>
</test-element-equals>
```

**webui behavior (incorrect):**
Preserves `<f-when>` elements in the rendered output without evaluating them. All branches are rendered regardless of the condition value.

```html
<!-- vara="3", shows content (correct) -->
<test-element-equals id="equals-true" vara="3">
  <template shadowrootmode="open">
    <f-when value="" data-fe-b-0>Equals 3</f-when>
  </template>
</test-element-equals>

<!-- vara="4", STILL shows content (incorrect — should be empty) -->
<test-element-equals id="equals-false" vara="4">
  <template shadowrootmode="open">
    <f-when value="" data-fe-b-0>Equals 3</f-when>
  </template>
</test-element-equals>
```

**Affected operators:** `==`, `!=`, `>=`, `>`, `<=`, `<`, `||`, `&&`, `!`, boolean truthiness.

**Nested conditionals** are also affected. In the `nested-when` fixture, webui hardcodes boolean literals (`value="false"`, `value="true"`) instead of preserving the expression for client-side evaluation.

---

## 2. Repeat Directives (`<f-repeat>`) Not Expanded Server-Side

**Severity:** Critical — causes failures across `repeat`, `repeat-event`, `deep-merge`, `dot-syntax`, and `observer-map` fixtures.

**fast-build behavior (correct):**
Iterates over the state array and emits one copy of the template body per item, wrapped in repeat boundary markers.

```html
<template shadowrootmode="open">
  <!--fe-b$$start$$0$$repeat-0$$fe-b-->
    <!--fe-repeat$$start$$0$$fe-repeat-->
      <li><!--fe-b$$start$$0$$0-item-0$$fe-b-->Foo<!--fe-b$$end$$0$$0-item-0$$fe-b--></li>
    <!--fe-repeat$$end$$0$$fe-repeat-->
    <!--fe-repeat$$start$$1$$fe-repeat-->
      <li><!--fe-b$$start$$0$$1-item-0$$fe-b-->Bar<!--fe-b$$end$$0$$1-item-0$$fe-b--></li>
    <!--fe-repeat$$end$$1$$fe-repeat-->
  <!--fe-b$$end$$0$$repeat-0$$fe-b-->
</template>
```

**webui behavior (incorrect):**
Preserves the `<f-repeat>` element in the output. The loop body appears once as a template rather than being expanded per item.

```html
<template shadowrootmode="open">
  <f-repeat value="" data-fe-b-0>
    <li><!--fe-b$$start$$1$$item$$fe-b--><!--fe-b$$end$$1$$item$$fe-b--></li>
  </f-repeat>
</template>
```

The items are not rendered — the text binding resolves to empty because the loop variable `item` has no value at build time.

---

## 3. Hydration Marker Format Differences

**Severity:** Major — affects client-side hydration for all fixtures.

### 3a. Binding path naming

fast-build includes a numeric suffix in the binding path; webui omits it.

| | fast-build | webui |
|---|---|---|
| Text binding | `<!--fe-b$$start$$0$$text-0$$fe-b-->` | `<!--fe-b$$start$$0$$text$$fe-b-->` |
| When marker | `<!--fe-b$$start$$0$$when-0$$fe-b-->` | _(not emitted — see issue 1)_ |
| Repeat marker | `<!--fe-b$$start$$0$$repeat-0$$fe-b-->` | _(not emitted — see issue 2)_ |

### 3b. Missing `shadowroot` attribute

fast-build emits both `shadowrootmode="open"` and `shadowroot="open"` on `<template>` tags for broader browser compatibility. webui emits only `shadowrootmode="open"`.

### 3c. Event binding attributes

Both renderers use `data-fe-c-X-Y` attributes for event bindings. The format is generally compatible, though the index values may differ due to different binding enumeration order.

---

## 4. Boolean and Property Attribute Bindings

**Severity:** Critical — causes failures in `attribute` and `host-bindings` fixtures.

**fast-build behavior (correct):**
Evaluates `?disabled="{{!isEnabled}}"` against state and emits the `disabled` attribute when the expression is true.

```html
<input type="checkbox" disabled>
```

**webui behavior (incorrect):**
Replaces the binding with a `data-fe-b-N` attribute but does not evaluate the expression or emit the boolean attribute.

```html
<input type="checkbox" data-fe-b-0>
```

Similarly, `:title="{hostTitle}"` property bindings are converted to `data-fe-b-N` without setting the property value.

---

## 5. Extra State and Metadata Injection

**Severity:** Minor — does not cause test failures directly but changes the DOM structure.

webui adds elements not present in fast-build output:

1. **Inventory meta tag:**
   ```html
   <meta name="webui-inventory" content="0020000000...">
   ```

2. **State script:**
   ```html
   <script>window.__webui_state={"text":"Hello world",...}</script>
   ```

These are part of webui's hydration protocol and are expected. However, state values that should be computed at runtime (e.g., from component properties) are serialized as static JSON.

---

## 6. Template Declaration Order

**Severity:** Minor — unlikely to cause functional issues.

fast-build preserves `<f-template>` declarations in their source declaration order. webui reorders them (appears to be alphabetical or by discovery order). The order does not affect correctness since templates are looked up by name.

---

## 7. Entity Encoding Differences

**Severity:** Minor — no functional impact observed.

webui encodes forward slashes in attribute values as `&#x2F;` while fast-build does not. Example:

| | fast-build | webui |
|---|---|---|
| HTML attribute | `&lt;p&gt;Hello world&lt;/p&gt;` | `&lt;p&gt;Hello world&lt;&#x2F;p&gt;` |

---

## 8. Whitespace and Formatting

**Severity:** Minor — no functional impact.

fast-build preserves source whitespace and indentation. webui minifies the output onto a single line. This makes debugging harder but does not affect rendering.

---

## Summary

| Issue | Severity | Test Impact |
|---|---|---|
| `<f-when>` not evaluated server-side | 🔴 Critical | ~20 failures |
| `<f-repeat>` not expanded server-side | 🔴 Critical | ~15 failures |
| Boolean/property bindings not evaluated | 🔴 Critical | ~5 failures |
| Hydration marker path format | 🟡 Major | May affect client hydration |
| Missing `shadowroot` compat attribute | 🟡 Major | May affect older browsers |
| Extra state/metadata injection | 🟢 Minor | No failures |
| Template declaration order | 🟢 Minor | No failures |
| Entity encoding | 🟢 Minor | No failures |
| Whitespace/formatting | 🟢 Minor | No failures |

The three critical issues (conditionals, repeats, and boolean bindings) account for all 44 test failures. These are all cases where webui's `--plugin=fast` preserves FAST directives as DOM elements rather than evaluating them server-side like fast-build does.

---

## Mitigation Applied: Syntax Conversion

The build script (`scripts/build-fixtures-with-webui.js`) converts FAST directive syntax to webui syntax before building:

| FAST syntax | webui syntax |
|---|---|
| `<f-when value="{{expr}}">` | `<if condition="expr">` |
| `</f-when>` | `</if>` |
| `<f-repeat value="{{item in list}}">` | `<for each="item in list">` |
| `</f-repeat>` | `</for>` |

This fixes the server-side evaluation (webui now resolves conditionals and expands repeats). However, it introduces a **hydration mismatch**: the `<f-template>` blocks webui injects for client-side hydration contain `<if>`/`<for>` syntax, while fast-html's client-side JavaScript expects `<f-when>`/`<f-repeat>`. This causes hydration failures in tests that rely on post-hydration interactivity (e.g., toggling conditionals, mutating repeat arrays).

Tests that only verify initial rendered state (binding, ref, slotted, attribute read, etc.) pass successfully.
